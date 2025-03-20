import { getUsers } from '../src/routes/user.route';

describe('getUsers function', () => {
  test('returns paginated users with default page and size', () => {
    const result = getUsers({});
    
    expect(result.users.length).toBe(2); // Default pageSize = 2
    expect(result.paging.totalResults).toBe(5);
    expect(result.paging.previous).toBeNull();
    expect(result.paging.next).toBeTruthy();
  });

  test('returns sorted users by name', () => {
    const result = getUsers({ sort: 'name' });

    expect(result.users[0].name).toBe('Andrew'); // Alphabetically first
    expect(result.users[1].name).toBe('Jorn');
  });

  test('returns sorted users by id', () => {
    const result = getUsers({ sort: 'id' });

    expect(result.users[0].id).toBe(0); // Smallest ID first
    expect(result.users[1].id).toBe(1);
  });

  test('returns correct pagination details', () => {
    const result = getUsers({ page: '2', size: '2' });

    expect(result.paging.previous).toEqual({ page: 1, size: 2, sort: undefined });
    expect(result.paging.next).toEqual({ page: 3, size: 2, sort: undefined });
  });

  test('handles invalid page and size', () => {
    const result = getUsers({ page: '-1', size: 'abc' });

    expect(result.users.length).toBe(2); // Defaults should apply
  });

  test('handles missing sort field', () => {
    const result = getUsers({ sort: 'unknownField' });

    expect(result.users.length).toBe(2); // Pagination should still work
  });
});