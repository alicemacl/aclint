export type AnnouncementPart =
  | 'name'
  | 'role'
  | 'state'
  | 'position'
  | 'value'
  | 'description';

export type VORoleEntry = {
  voLabel: string;
  order: AnnouncementPart[];
  states?: Record<string, { true: string; false: string; mixed?: string }>;
  announcesPosition?: boolean;
  usesHeadingLevel?: boolean;
};
