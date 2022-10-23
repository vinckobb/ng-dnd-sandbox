/**
 * Data that occured after drag ended
 */
export interface DropTargetData
{
    /**
     * Id of component that should handle drop data
     */
    id: string;

    /**
     * Data to be passed to component
     */
    data: any;
}

/**
 * Data used for displaying preview of drop placeholder
 */
export interface DropPlaceholderPreview
{
    /**
     * Id of parent which should display preview
     */
    parentId: string|undefined|null;

    /**
     * Index at which should be preview displayed
     */
    index: number;

    /**
     * Data for displaying placeholder preview
     */
    placeholder: any;
}