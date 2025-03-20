import express, { Request, Response } from 'express';

interface User {
  name: string;
  id: number;
}


const router = express.Router();
const users: User[] = [{
  name: 'Jorn',
  id: 0,
}, {
  name: 'Markus',
  id: 3,
}, {
  name: 'Andrew',
  id: 2,
}, {
  name: 'Ori',
  id: 4,
}, {
  name: 'Mike',
  id: 1,
}];

router.get('/', (req: Request, res: Response) => {
  let { sort, size, page } = req.query;
  
  // Convert query parameters to correct types
  const pageSize = size ? parseInt(size as string, 10) : 2;
  const pageNumber = page ? parseInt(page as string, 10) : 1;
  
  // Sort users if sort parameter is provided
  let sortedUsers = [...users];
  console.log(sortedUsers)
  if (sort && ['name', 'id'].includes(sort as string)) {
    sortedUsers.sort((a, b) => 
      a[sort as keyof User] > b[sort as keyof User] ? 1 : -1
    );
  }

  // Pagination logic
  const totalResults = sortedUsers.length;
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
  
  // Construct previous and next page URLs
  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
  const previous = pageNumber > 1 ? `${baseUrl}/?page=${pageNumber - 1}&size=${pageSize}&sort=${sort}` : null;
  const next = endIndex < totalResults ? `${baseUrl}/?page=${pageNumber + 1}&size=${pageSize}&sort=${sort}` : null;

  res.json({
    users: paginatedUsers,
    paging: {
      previous,
      next,
      totalResults,
    },
  });
});

export default router;