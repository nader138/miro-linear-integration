export interface MiroStickyNote {
    id: string;
    content: string;
    position: {
        origin: 'center';
        x: number;
        y: number;
    };
    shape: 'square' | 'rectangle';
    style?: {
        fillColor?: string;
        textAlign?: 'left' | 'center' | 'right';
        textAlignVertical?: 'top' | 'middle' | 'bottom';
    };
}

export interface LinearIssue {
    id: string;
    title: string;
    description: string | null;
    status: string;
    url: string;
}

export type CreateStickyNoteParams = {
    boardId: string;
    content: string;
    position?: {
        x: number;
        y: number;
    };
};

export type CreateLinearIssueParams = {
    title: string;
    description?: string;
    teamId: string;
};