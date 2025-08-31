import {
   delGroupMessageService,
   getGroupMessagesService,
   getMyGroupsService,
   sendGroupMessageService
} from "../services/groupChat.service.js";



export const getMyGroups = async (req, res, next) => {
   try {
      const userId = req.user.id;
      const role = req.user.role;
      const myGroups = await getMyGroupsService({ userId, role });

      return res.status(201).json({ success: true, message: 'My Groups.', data: myGroups });
   } catch (err) {
      next(err);
   }
};


export const sendGroupMessage = async (req, res, next) => {
   try {
      const senderName = req.userName;
      const senderId = req.user.id;
      const role = req.role;
      const { message } = req.body;
      const courseId = req.params.courseId;
      const courseName = req.courseName;

      const messageData = await sendGroupMessageService({ courseId, courseName, senderId, senderName, role, message });

      return res.status(201).json({ success: true, message: 'message sent', data: messageData });
   } catch (err) {
      next(err);
   }
};


export const getGroupMessages = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;

      const groupMessages = await getGroupMessagesService({ courseId });

      return res.status(200).json({ success: true, message: 'Group Messages.', data: groupMessages });
   } catch (err) {
      next(err);
   }
};


export const deleteGroupMessages = async (req, res, next) => {
   try {
      const { messageId } = req.body;

      const delMessage = await delGroupMessageService({ messageId });

      return res.status(200).json({ success: true, message: 'Group Messages deleted.', data: delMessage });
   } catch (err) {
      next(err);
   }
};