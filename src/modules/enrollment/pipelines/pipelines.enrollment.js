
export const overallStats = [
   {
      $group: {
         _id: null,
         totalEnrollments: { $sum: 1 },
         activeEnrollments: {
            $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] }
         },
         completedCourses: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
         },
         totalProgress: { $sum: '$progress' }
      }
   },
   {
      $addFields: {
         completionRate: {
            $cond: [
               { $eq: ['$totalEnrollments', 0] },
               '0%',
               {
                  $concat: [
                     {
                        $toString: {
                           $multiply: [
                              { $divide: ['$completedCourses', '$totalEnrollments'] },
                              100
                           ]
                        }
                     },
                     '%'
                  ]
               }
            ]
         },
         activeRate: {
            $cond: [
               { $eq: ['$totalEnrollments', 0] },
               '0%',
               {
                  $concat: [
                     {
                        $toString: {
                           $multiply: [
                              { $divide: ['$activeEnrollments', '$totalEnrollments'] },
                              100
                           ]
                        }
                     },
                     '%'
                  ]
               }
            ]
         },
         averageProgress: {
            $cond: [
               { $eq: ['$totalEnrollments', 0] },
               '0%',
               {
                  $concat: [
                     {
                        $toString: {
                           $divide: ['$totalProgress', '$totalEnrollments']
                        }
                     },
                     '%'
                  ]
               }
            ]
         }
      }
   },
   {
      $project: {
         _id: 0,
         totalEnrollments: 1,
         activeEnrollments: 1,
         completedCourses: 1,
         completionRate: 1,
         activeRate: 1,
         averageProgress: 1
      }
   }
];


export const topCoursesByEnrollment = [
   {
      $group: {
         _id: '$courseId',
         totalEnrollments: { $sum: 1 }
      }
   },
   { $sort: { totalEnrollments: -1 } },
   { $limit: 2 },
   {
      $lookup: {
         from: 'courses',
         localField: '_id',
         foreignField: '_id',
         as: 'course'
      }
   },
   { $unwind: '$course' },
   {
      $project: {
         _id: 0,
         courseId: '$course._id',
         title: '$course.title',
         category: '$course.category',
         totalEnrollments: 1
      }
   }
];


export const topInstructorsByEnrollment = [
   {
      $group: {
         _id: '$courseId',
         enrollmentCount: { $sum: 1 }
      }
   },
   {
      $lookup: {
         from: 'courses',
         localField: '_id',
         foreignField: '_id',
         as: 'course'
      }
   },
   { $unwind: '$course' },
   {
      $group: {
         _id: '$course.instructor',
         totalEnrollments: { $sum: '$enrollmentCount' }
      }
   },
   {
      $lookup: {
         from: 'instructors',
         localField: '_id',
         foreignField: '_id',
         as: 'instructor'
      }
   },
   { $unwind: '$instructor' },
   {
      $lookup: {
         from: 'users',
         localField: 'instructor.user',
         foreignField: '_id',
         as: 'user'
      }
   },
   { $unwind: '$user' },
   { $sort: { totalEnrollments: -1 } },
   {
      $project: {
         _id: 0,
         instructorName: '$user.name',
         instructorEmail: '$user.email',
         totalEnrollments: 1
      }
   },

];


export const newEnrollmentsThisMonth = [
   {
      $match: {
         $expr: {
            $and: [
               { $eq: [{ $month: '$createdAt' }, new Date().getMonth() + 1] },
               { $eq: [{ $year: '$createdAt' }, new Date().getFullYear()] }
            ]
         }
      }
   },
   {
      $addFields: {
         monthName: { $dateToString: { format: '%B', date: '$createdAt' } }
      }
   },
   {
      $group: {
         _id: null,
         monthName: { $first: '$monthName' },
         totalEnrollments: { $sum: 1 },
         activeEnrollments: {
            $sum: {
               $cond: [{ $eq: ['$completed', false] }, 1, 0]
            }
         },
         completedCourses: {
            $sum: {
               $cond: [{ $eq: ['$completed', true] }, 1, 0]
            }
         }
      }
   },
   {
      $project: {
         _id: 0,
         monthName: 1,
         totalEnrollments: 1,
         activeEnrollments: 1,
         completedCourses: 1
      }
   }
];