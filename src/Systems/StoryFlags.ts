export class StoryFlagSystem {
  static storyflags: Record<string, any> = {};

  static init(): any {
    return this.storyflags;
  }

  static getStoryFlags(): any {
    return this.storyflags;
  }

  static setStoryFlagValue(label: string, value: any) {
    //console.log(label, value);

    this.storyflags[label] = value;
  }

  static readStoryFlagValue(label: string): any {
    return this.storyflags[label];
  }
}
