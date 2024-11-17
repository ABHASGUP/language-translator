import { LessonCategory } from '../types';

export const lessonCategories: LessonCategory[] = [
  {
    id: 'basics',
    title: 'Basics',
    lessons: [
      {
        id: 'basics-1',
        title: 'Basics I',
        description: 'Essential phrases and greetings',
        level: 1,
        xp: 10,
        phrases: ['Hello', 'Thank you', 'Please', 'Yes', 'No']
      },
      {
        id: 'basics-2',
        title: 'Basics II',
        description: 'Numbers and simple conversations',
        level: 1,
        xp: 15,
        phrases: ['One', 'Two', 'Three', 'How are you?', 'Good morning']
      }
    ]
  },
  {
    id: 'home',
    title: 'At Home',
    lessons: [
      {
        id: 'home-1',
        title: 'Family Members',
        description: 'Learn to talk about your family',
        level: 2,
        xp: 20,
        phrases: ['Mother', 'Father', 'Sister', 'Brother', 'Family']
      },
      {
        id: 'home-2',
        title: 'Daily Routines',
        description: 'Discuss daily activities at home',
        level: 2,
        xp: 20,
        phrases: ['Wake up', 'Breakfast', 'Sleep', 'Dinner', 'Clean']
      }
    ]
  },
  {
    id: 'market',
    title: 'Shopping',
    lessons: [
      {
        id: 'market-1',
        title: 'At the Store',
        description: 'Shopping vocabulary and phrases',
        level: 3,
        xp: 25,
        phrases: ['How much?', 'Too expensive', 'Discount', 'Buy', 'Sell']
      },
      {
        id: 'market-2',
        title: 'Groceries',
        description: 'Food and grocery shopping',
        level: 3,
        xp: 25,
        phrases: ['Vegetables', 'Fruit', 'Meat', 'Fish', 'Bread']
      }
    ]
  },
  {
    id: 'office',
    title: 'At Work',
    lessons: [
      {
        id: 'office-1',
        title: 'Office Basics',
        description: 'Common office vocabulary',
        level: 4,
        xp: 30,
        phrases: ['Meeting', 'Email', 'Project', 'Deadline', 'Team']
      },
      {
        id: 'office-2',
        title: 'Business Talk',
        description: 'Professional conversations',
        level: 4,
        xp: 30,
        phrases: ['Presentation', 'Report', 'Client', 'Schedule', 'Budget']
      }
    ]
  },
  {
    id: 'school',
    title: 'Education',
    lessons: [
      {
        id: 'school-1',
        title: 'Classroom',
        description: 'School and classroom vocabulary',
        level: 2,
        xp: 20,
        phrases: ['Teacher', 'Student', 'Book', 'Homework', 'Class']
      },
      {
        id: 'school-2',
        title: 'Academic Life',
        description: 'Academic discussions and terms',
        level: 3,
        xp: 25,
        phrases: ['Exam', 'Study', 'Research', 'Library', 'Course']
      }
    ]
  },
  {
    id: 'society',
    title: 'Social Life',
    lessons: [
      {
        id: 'society-1',
        title: 'Meeting People',
        description: 'Social interactions and small talk',
        level: 3,
        xp: 25,
        phrases: ['Nice to meet you', 'Where from?', 'Hobby', 'Friends', 'Party']
      },
      {
        id: 'society-2',
        title: 'Culture & Events',
        description: 'Cultural activities and events',
        level: 4,
        xp: 30,
        phrases: ['Festival', 'Concert', 'Museum', 'Theater', 'Exhibition']
      }
    ]
  }
];