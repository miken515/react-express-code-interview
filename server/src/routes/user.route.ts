import express, { Request, Response } from 'express';

interface User {
  name: string;
  id: number;
}

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

export const getUsers = (query: { sort?: string; size?: string; page?: string }) => {
  console.log('Query:', query);
  let { sort, size, page } = query;

  // Convert query parameters to numbers, ensuring valid defaults
  const pageSize = Number.isNaN(parseInt(size, 10)) || parseInt(size, 10) <= 0 ? 2 : parseInt(size, 10);
  const pageNumber = Number.isNaN(parseInt(page, 10)) || parseInt(page, 10) <= 0 ? 1 : parseInt(page, 10);

  // Clone the users array to avoid mutating the original data
  let sortedUsers = [...users];

  // Sorting logic
  if (sort && Object.keys(users[0]).includes(sort)) {
    //  Dynamically supports new fields in the future
    sortedUsers.sort((a, b) => {
      const field = sort as keyof User;

      if (typeof a[field] === 'string' && typeof b[field] === 'string') {
        return (a[field] as string).localeCompare(b[field] as string);
      }
      return (a[field] as number) - (b[field] as number);
    });
  }
  
  console.log(`Sorted users:`, sortedUsers);

  // Calculate pagination indexes
  const totalResults = sortedUsers.length;
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Extract the relevant slice of users for the requested page
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  // Construct previous and next pagination links only if applicable
  const previous = pageNumber > 1 ? { page: pageNumber - 1, size: pageSize, sort } : null;
  const next = endIndex < totalResults ? { page: pageNumber + 1, size: pageSize, sort } : null;

  console.log(`Previous: ${previous ? JSON.stringify(previous) : 'None'}`);
  console.log(`Next: ${next ? JSON.stringify(next) : 'None'}`);
  console.log(`Total Results: ${totalResults ? JSON.stringify(totalResults) : 'None'}`);
  console.log(`Paginated Users:`, paginatedUsers);

  return {
    users: paginatedUsers,
    paging: { previous, next, totalResults },
  };
};

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  const response = getUsers(req.query);
  
  res.json(response);
});

export default router;