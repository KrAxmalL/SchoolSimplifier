package ua.edu.ukma.school_simplifier.domain.dto.mappers;

import ua.edu.ukma.school_simplifier.domain.dto.mark.MarkSummary;
import ua.edu.ukma.school_simplifier.domain.dto.mark.TeacherMarkSummary;
import ua.edu.ukma.school_simplifier.domain.models.MarkBookRecord;

public class MarkRecordMapper {

    public static MarkSummary toMarkSummary(MarkBookRecord markBookRecord) {
        MarkSummary markSummary = new MarkSummary();
        markSummary.setRecordDate(markBookRecord.getRecordDate());
        markSummary.setMark(markBookRecord.getMark());
        markSummary.setDescription(markBookRecord.getDescription());
        return markSummary;
    }

    public static TeacherMarkSummary toTeacherMarkSummary(MarkBookRecord markBookRecord) {
        TeacherMarkSummary teacherMarkSummary = new TeacherMarkSummary();
        teacherMarkSummary.setRecordDate(markBookRecord.getRecordDate());
        teacherMarkSummary.setStudentPresent(markBookRecord.isStudentPresent());
        teacherMarkSummary.setMark(markBookRecord.getMark());
        teacherMarkSummary.setDescription(markBookRecord.getDescription());
        teacherMarkSummary.setSubjectName(markBookRecord.getSubject().getSubjectName());
        return teacherMarkSummary;
    }
}
