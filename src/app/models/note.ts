export class Note {
    constructor(
        public noteId: string,
        public lessonId: string,
        public lessonTitle: string,
        public collectionId: string,
        public position: string,
        public status: string,
        public level: string,
        public note: string,
        public createdOn: Date,
        public updatedOn: Date,
        public userId: string
    ) { }
}
