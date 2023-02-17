import { User } from 'src/@types';

function generateFakeData(): User[] {
  const userData: User[] = [];

  for (let i = 0; i < 3; i++) {
    const user: User = {
      id: i + 1,
      avatar: `https://example.com/avatar/${i}`,
      code: `code_${i}`,
      eduMail: `edu_${i}@example.com`,
      isActive: i % 2 === 0,
      name: `User ${i + 1}`,
      personalMail: `personal_${i}@example.com`,
      phoneNumber: `555-555-${i.toString().padStart(4, '0')}`,
      role: i % 3,
      schoolYear: `202${i}`,
      curriculumId: i + 100,
    };

    userData.push(user);
  }

  return userData;
}

export const userData = generateFakeData();
