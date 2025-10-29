
export const totalStats = [
   {
      $group: {
         _id: null,
         totalReviews: { $sum: 1 },
         avgRating: { $avg: '$rating' }
      }
   },

   {
      $project: {
         _id: 0,
         totalReviews: 1,
         avgRating: { $round: ["$avgRating", 1] }
      }
   }
];


export const ratingDistribution = [
   {
      $group: {
         _id: '$rating',
         count: { $sum: 1 },
      }
   },

   {
      $project: {
         _id: 0,
         rating: '$_id',
         count: 1
      }
   }
];


export const latestReviews = [
   { $sort: { createdAt: -1 } },
   { $limit: 2 },
   {
      $project: {
         _id: 0,
         courseName: 1,
         rating: 1,
         comment: 1,
         createdAt: 1
      }
   }
];