import { Lesson } from './lesson';
export class Note {
    constructor(
        public lessonId: string,
        public rating: number,
        public status: string,
        public level: number,
        public note: string
    ) { }
}