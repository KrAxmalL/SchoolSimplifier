import { Roles } from "../domain/constants";

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