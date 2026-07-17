"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";
import { useGetConversationsQuery } from "../redux/features/chat/messagingApi";
import { messagingApi } from "../redux/features/chat/messagingApi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  decrementUnreadMessages,
  incrementUnreadMessages,
  setUnreadMessages,
} from "../redux/features/notifications/notificationSlice";

type SocketConversation = {
  id: string;
  user1: { id: string; name: string; avatarUrl?: string | null };
  user2: { id: string; name: string; avatarUrl?: string | null };
  user1Id: string;
  user2Id: string;
  lastMessageText?: string | null;
  lastMessageAt?: string | null;
  lastSenderId?: string | null;
};

type SocketMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  text?: string | null;
  createdAt: string;
};

export function MessageNotificationProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname() || "";
  const user = useAppSelector((state) => state.auth.user);
  const pathnameRef = useRef(pathname);

  const { data: conversationsData } = useGetConversationsQuery(undefined, {
    skip: !user,
  });

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!user) {
      dispatch(setUnreadMessages(0));
      return;
    }

    const conversations = conversationsData?.conversations || [];
    const totalUnread = conversations.reduce(
      (sum: number, conversation: any) => sum + (conversation.unreadCount || 0),
      0
    );
    dispatch(setUnreadMessages(totalUnread));
  }, [conversationsData, dispatch, user]);

  useEffect(() => {
    if (!user?.id) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = getSocket(token);
    socket.connect();
    socket.emit("presence:active", { isActive: true });

    const updateConversationPreview = (conversation: SocketConversation, unreadDelta = 0) => {
      const otherUser = conversation.user1Id === user.id
        ? conversation.user2
        : conversation.user1;

      dispatch(
        messagingApi.util.updateQueryData("getConversations", undefined, (draft: any) => {
          if (!draft?.conversations) return;

          const existing = draft.conversations.find((item: any) => item.id === conversation.id);
          const nextConversation = {
            id: conversation.id,
            otherUser,
            lastMessageText: conversation.lastMessageText,
            lastMessageAt: conversation.lastMessageAt,
            lastSenderId: conversation.lastSenderId,
            unreadCount: Math.max(0, (existing?.unreadCount || 0) + unreadDelta),
          };

          draft.conversations = [
            nextConversation,
            ...draft.conversations.filter((item: any) => item.id !== conversation.id),
          ].sort(
            (a: any, b: any) =>
              new Date(b.lastMessageAt || 0).getTime() -
              new Date(a.lastMessageAt || 0).getTime()
          );
        })
      );
    };

    const handleNewMessage = (payload: any) => {
      const conversation = payload?.conversation as SocketConversation | undefined;
      const message = payload?.message as SocketMessage | undefined;
      if (!conversation || !message || message.recipientId !== user.id) return;

      const otherUser = conversation.user1Id === user.id
        ? conversation.user2
        : conversation.user1;
      const isMessagesPage = pathnameRef.current.startsWith("/messages");

      if (isMessagesPage) return;

      updateConversationPreview(conversation, 1);
      dispatch(incrementUnreadMessages(1));
      toast.message(`New message from ${otherUser.name}`, {
        description: message.text || conversation.lastMessageText || "Sent an attachment",
        action: {
          label: "Open",
          onClick: () => {
            window.location.href = "/messages";
          },
        },
      });
    };

    const handleUpdatedMessage = (payload: any) => {
      if (pathnameRef.current.startsWith("/messages")) return;

      const conversation = payload?.conversation as SocketConversation | undefined;
      if (!conversation) return;
      updateConversationPreview(conversation);
    };

    const handleDeletedMessage = (payload: any) => {
      if (pathnameRef.current.startsWith("/messages")) return;

      const conversation = payload?.conversation as SocketConversation | undefined;
      if (!conversation) return;

      const wasUnread = payload?.recipientId === user.id && Boolean(payload?.wasUnread);
      updateConversationPreview(conversation, wasUnread ? -1 : 0);
      if (wasUnread) {
        dispatch(decrementUnreadMessages(1));
      }
    };

    const handleDeletedConversation = (payload: any) => {
      if (pathnameRef.current.startsWith("/messages")) return;

      const conversationId = payload?.conversationId as string | undefined;
      if (!conversationId) return;

      const unreadCount = Number(payload?.unreadCountsByUser?.[user.id] || 0);
      dispatch(
        messagingApi.util.updateQueryData("getConversations", undefined, (draft: any) => {
          if (!draft?.conversations) return;
          draft.conversations = draft.conversations.filter(
            (conversation: any) => conversation.id !== conversationId
          );
        })
      );
      if (unreadCount > 0) {
        dispatch(decrementUnreadMessages(unreadCount));
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:updated", handleUpdatedMessage);
    socket.on("message:deleted", handleDeletedMessage);
    socket.on("conversation:deleted", handleDeletedConversation);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:updated", handleUpdatedMessage);
      socket.off("message:deleted", handleDeletedMessage);
      socket.off("conversation:deleted", handleDeletedConversation);
      socket.emit("presence:active", { isActive: false });
      socket.disconnect();
    };
  }, [dispatch, user?.id]);

  return <>{children}</>;
}
