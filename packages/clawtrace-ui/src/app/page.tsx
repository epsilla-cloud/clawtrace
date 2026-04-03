import { redirect } from 'next/navigation';

// The control room is the landing page — redirect root to the console.
export default function HomePage() {
  redirect('/overview');
}
