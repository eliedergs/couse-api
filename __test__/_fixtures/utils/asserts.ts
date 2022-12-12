import LiteratureEntity from '@/domain/entities/literature.entity';
import { countDrafts, countTimeline, isValidFormattedDate } from '.';

export interface AssertLiteratureOptions {
    draftsCount?: number;
    timelineCount?: number;
}

export const assertLiterature = <T>(
    received: T,
    entity: LiteratureEntity,
    options: AssertLiteratureOptions = {},
) => {
    const timelineMustBe = !options.hasOwnProperty('timelineCount')
        ? countTimeline(entity.pericopes)
        : options.draftsCount;
    const draftsMustBe = !options.hasOwnProperty('draftsCount')
        ? countDrafts(entity.pericopes)
        : options.draftsCount;

    expect(received).toBeDefined();
    expect(received['views']).toBeDefined();
    expect(received['likes']).toBeDefined();
    expect(received['preview']).toBeDefined();
    expect(received['timeline'].length).toBe(timelineMustBe);
    expect(received['drafts'].length).toBe(draftsMustBe);
    expect(isValidFormattedDate(received['createdAt'])).toBe(true);
    expect(isValidFormattedDate(received['updatedAt'])).toBe(true);
};
