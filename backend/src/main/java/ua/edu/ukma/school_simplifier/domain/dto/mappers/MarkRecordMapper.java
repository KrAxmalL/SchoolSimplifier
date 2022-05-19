package ua.edu.ukma.school_simplifier.domain.dto.mappers;

import ua.edu.ukma.school_simplifier.domain.dto.mark.MarkSummary;
import ua.edu.ukma.school_simplifier.domain.models.MarkBookRecord;

public class MarkRecordMapper {

    public static MarkSummary toMarkSummary(MarkBookRecord markBookRecord) {
        MarkSummary markSummary = new MarkSummary();
        markSummary.setRecordDate(markBookRecord.getRecordDate());
        markSummary.setMark(markBookRecord.getMark());
        markSummary.setDescription(markBookRecord.getDescription());
        return markSummary;
    }
}
