export interface SideBarItemData {
  label: string;
  icon: string;
  route: string;
  items?: SideBarItemData[];
}