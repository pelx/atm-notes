export class Collection {
    constructor(
        public collectionId: string,
        public title: string,
        public description: string,
        public imageUrl: Promise<string>
    ) { }
}