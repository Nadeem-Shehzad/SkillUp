import { StudentPublicService } from "../../student/index.js";


export const StudentClientService = {
    async checkStudentExists(studentId){
        const student = await StudentPublicService.studentExists(studentId);
        return student;
    }
}