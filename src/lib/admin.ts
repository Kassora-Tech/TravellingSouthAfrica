import type { User } from 'firebase/auth';

const ADMIN_EMAILS = [
  'maryke@travellingsouthafrica.co.za',
  'tristan@industrialgrowthhub.com',
  'charles@travellingsouthafrica.co.za',
];

export const isAdmin = (user: User | null): boolean => {
  if (!user || !user.email) {
    return false;
  }
  return ADMIN_EMAILS.includes(user.email);
};
