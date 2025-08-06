
import {
   addBookmarkCourseService,
   deleteBookmarkService,
   findLoginStudent,
   getBookmarksService,
   getStudentProfile,
   updateUserProfile
} from "../services/student.services.js";


export const getProfile = async (req, res, next) => {

   try {
      const user = await getStudentProfile(req);
      return res.status(200).json({ success: true, message: 'User Profile Data.', data: user });

   } catch (error) {
      next(error);
   }
}


// need to update code according to --> findLoginStudent
export const updateProfile = async (req, res, next) => {
   try {
      const user = await findLoginStudent(req.user);
      await updateUserProfile(user, req);

      res.status(200).json({ success: true, message: 'User Profile Updated.', data: null });

   } catch (error) {
      next(error);
   }
}


export const addCourseToBookmark = async (req, res, next) => {
   try {
      const student = await findLoginStudent(req.user);
      const courseId = req.params.courseId;
      const studentId = student._id;

      const bookmarked = await addBookmarkCourseService({ studentId, courseId });

      res.status(200).json({ success: true, message: 'Course added to Bookmark.', data: bookmarked });

   } catch (error) {
      next(error);
   }
}


export const getBookmarks = async (req, res, next) => {
   try {
      const student = await findLoginStudent(req.user);
      const studentId = student._id;

      const bookmarkes = await getBookmarksService({ studentId });

      res.status(200).json({ success: true, message: 'All Bookmark.', data: bookmarkes });

   } catch (error) {
      next(error);
   }
}


export const deleteBookmark = async (req, res, next) => {
   try {
      const student = await findLoginStudent(req.user);
      const bookmarkId = req.params.id;

      await deleteBookmarkService({ student, bookmarkId });

      res.status(200).json({ success: true, message: 'Bookmark Deleted.', data: null });

   } catch (error) {
      next(error);
   }
}