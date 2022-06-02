import { Roles } from "../domain/constants";

const studentMenus = [
  {
      link: '/student/schedule',
      title: 'Розклад'
  },
  {
      link: '/student/subjects',
      title: 'Предмети'
  },
  {
      link: '/student/class',
      title: 'Клас'
  },
  {
      link: '/student/marks',
      title: 'Оцінки'
  }
];

const teacherMenus = [
  {
      link: '/teacher/schedule',
      title: 'Розклад'
  },
  {
      link: '/teacher/subjects',
      title: 'Предмети'
  },
  {
      link: '/teacher/markBook',
      title: 'Журнал оцінок'
  },
];

const formTeacherMenus = [
  {
      link: '/formteacher/class',
      title: 'Мій клас'
  },
  {
      link: '/formteacher/classMarkBook',
      title: 'Класний журнал оцінок'
  },
];

const headTeacherMenus = [
  {
      link: '/headteacher/class',
      title: 'Шкільні класи'
  },
  {
      link: '/headteacher/schedule',
      title: 'Шкільний розклад'
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
    if(!roles || roles.length === 0) {
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
      throw new Error('Invalid role!');
    }
}