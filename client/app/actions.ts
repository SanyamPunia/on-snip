"use server";

import { verifyCaptchaToken } from "@/lib/captcha";
import { redis } from "@/lib/redis";
import { redirect } from "next/navigation";

export const createTopic = async ({
  topicName,
  token,
}: {
  topicName: string;
  token: string | null;
}) => {
  if (!token) {
    return {
      success: false,
      message: "Token not found",
    };
  }

  // verify token
  const captchaData = await verifyCaptchaToken(token);

  if (!captchaData) {
    return {
      success: false,
      message: "Captcha Failed",
    };
  }

  if (!captchaData.success || captchaData.score < 0.5) {
    return {
      success: false,
      message: "Captcha Failed",
      errors: !captchaData.success ? captchaData["error-code"] : undefined,
    };
  }

  const toKebabCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const kebabCaseTopic = toKebabCase(topicName);

  const regex = /^[a-z-]+$/;

  if (!kebabCaseTopic || kebabCaseTopic.length > 50) {
    return {
      error: "Name must be between 1 & 50 characters",
    };
  }

  if (!regex.test(kebabCaseTopic)) {
    return {
      error: "Only letters and hyphens are allowed",
    };
  }

  await redis.sadd("existing-topics", kebabCaseTopic);

  redirect(`/${kebabCaseTopic}`);
};

export const submitComment = async ({
  comment,
  room,
}: {
  comment: string;
  room: string;
}) => {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const messageObject = { text: comment, id };

  await redis.rpush(`room:${room}:comments`, JSON.stringify(messageObject));

  await redis.incr("served-requests");
  await redis.publish(`room:${room}`, JSON.stringify(messageObject));

  return messageObject;
};
