export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'teacher';
    imageUrl?: string;
    assignedClass?: 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5' | 'Grade 6';
}