import { Instructor } from "../../../src/modules/instructor/models/instructor.model"


export const createInstructor = async ({instID}) => {
   const instructor = await Instructor.create({
      user: instID,
      bio: 'Experienced backend developer',
      expertise: ['Node.js', 'MongoDB'],
   });

   return instructor;
}