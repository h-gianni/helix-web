export interface ActionCount {
    orgActions: number;
  }

  export interface Action {
    id: string;
    name: string;
    description: string;
    impactScale: number;
    _count: ActionCount;
  }

  export interface ActionCategory {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    actions: Action[];
  }

  export interface ActionCategoriesProps {
    categories: ActionCategory[];
    onCategorySelect?: (categoryId: string) => void;
    onActionSelect?: (actionId: string) => void;
    selectedCategoryId?: string;
    selectedActionIds?: string[];
  }

  export interface ApiResponse {
    success: boolean;
    data: ActionCategory[];
  }

  export interface FormattedActionsResponse {
    success: boolean;
    data: {
      [categorySlug: string]: string[];
    };
  }