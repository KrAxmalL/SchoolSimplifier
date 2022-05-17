
export const getHomePageForUser = (roles) => {
    if(!roles) {
      return '/login';
    }
    else if(roles.includes('STUDENT')) {
      return '/student/schedule';
    }
    else if(roles.includes('TEACHER')) {
      return '/teacher/schedule';
    }
    else if(roles.includes('HEAD_TEACHER')) {
      return '/headteacher/schedule';
    }
    else {
      return '/unauthorized';
    }
}