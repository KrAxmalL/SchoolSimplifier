import { Roles } from "../domain/constants";

const studentMenus = [
  {
      link: '/student/schedule',
      title: 'Schedule'
  },
  {
      link: '/student/subjects',
      title: 'Subjects'
  },
  {
      link: '/student/class',
      title: 'Class'
  },
  {
      link: '/student/marks',
      title: 'Marks'
  }
];

const teacherMenus = [
  {
      link: '/teacher/schedule',
      title: 'Schedule'
  },
  {
      link: '/teacher/subjects',
      title: 'Subjects'
  },
  {
      link: '/teacher/markBook',
      title: 'Mark Book'
  },
];

const formTeacherMenus = [
  {
      link: '/formteacher/class',
      title: 'My Class'
  },
  {
      link: '/formteacher/classMarkBook',
      title: 'My Class Mark Book'
  },
];

const headTeacherMenus = [
  {
      link: '/headteacher/class',
      title: 'Classes'
  },
  {
      link: '/headteacher/schedule',
      title: 'General Schedule'
  },
];

export const getMenusForRole = (role) => {
  if(role.localeCompare(Roles.STUDENT) === 0) {
    return studentMenus;
  }
  else if(role.localeCompare(Roles.TEACHER) === 0) {
    return teacherMenus;
  }
  else if(role.localeCompare(Roles.FORMTEACHER) === 0) {
    return formTeacherMenus;
  }
  else if(role.localeCompare(Roles.HEADTEACHER) === 0) {
    return headTeacherMenus;
  }
  else {
    return [];
  }
}

export const getHomePageForUser = (roles) => {
    if(!roles) {
      return '/login';
    }
    else if(roles.includes(Roles.STUDENT)) {
      return '/student/schedule';
    }
    else if(roles.includes(Roles.TEACHER)) {
      return '/teacher/schedule';
    }
    else if(roles.includes(Roles.HEADTEACHER)) {
      return '/headteacher/schedule';
    }
    else {
      return '/unauthorized';
    }
}