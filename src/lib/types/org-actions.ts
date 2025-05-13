export interface OrgAction {
  id?: string;
  actionId: string;
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
}

export interface ActionCategory {
  id: string;
  name: string;
  actions: Action[];
}

export interface Action {
  id: string;
  name: string;
  categoryId: string;
}
