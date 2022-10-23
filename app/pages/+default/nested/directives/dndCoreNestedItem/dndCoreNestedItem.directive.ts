import {Directive, ElementRef, EventEmitter, Inject, Injector, Input, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {BindThis, isBlank, isPresent} from '@jscrpt/common';
import {DndService, DragSource, DropTarget, DropTargetMonitor} from '@ng-dnd/core';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

import {DndBusService} from '../../../../../services/dndBus';
import {DragActiveService} from '../../../../../services/dragActive';

/**
 * Directive used for initializing and handling dnd core functionality for nested item
 */
@Directive(
{
    selector: '[dndCoreNestedItem]',
    exportAs: 'dndCoreNestedItem',
})
export class DndCoreNestedItemDirective implements OnInit, OnDestroy
{
    //######################### protected properties #########################

    public get data(): any
    {
        if(!this.dragData.data)
        {
            throw new Error('DndCoreTreeItemDirective: invalid drag data without data!');
        }

        return this.dragData.data;
    }

    /**
     * Gets indication whether component can accept drop
     */
    public get canDrop(): boolean
    {
        return true;
    }

    /**
     * Subscriptions created during initialization
     */
    protected initSubscriptions: Subscription = new Subscription();

    /**
     * Subscription for placeholder connection to DOM
     */
    protected placeholderConnection: Subscription|undefined|null;

    /**
     * Subscription for container connection to DOM
     */
    protected containerConnection: Subscription|undefined|null;

    /**
     * Element that represents placeholder preview
     */
    protected placeholderPreviewElement: HTMLElement|undefined|null;

    /**
     * Drop zone target that handles drop of component
     */
    protected placeholderDrop: DropTarget<any, any> = this.dnd.dropTarget(['TREE_COMPONENT'],
                                                                                                  {
                                                                                                      canDrop: () => true,
                                                                                                      drop: monitor =>
                                                                                                      {
                                                                                                          const item = monitor.getItem();
                                                                                                          let index = this.bus.dropPlaceholderPreviewIndex;
                                                                                                  
                                                                                                          if(item && isPresent(item.dragData.index) && isPresent(index))
                                                                                                          {
                                                                                                              //same parent and higher index
                                                                                                              if(index > item.dragData.index)
                                                                                                              {
                                                                                                                  index--;
                                                                                                              }
                                                                                                          }

                                                                                                          return <any>{
                                                                                                              index,
                                                                                                              id: this.data?.id,
                                                                                                          };
                                                                                                      },
                                                                                                  }, this.initSubscriptions);

    /**
     * Drop zone target that handles drop of component
     */
    protected containerDrop: DropTarget<any, any> = this.dnd.dropTarget(['TREE_COMPONENT'],
                                                                                                {
                                                                                                    canDrop: () => true,
                                                                                                    drop: monitor =>
                                                                                                    {
                                                                                                        const [index, id] = this.getFixedDropCoordinates(monitor, false);

                                                                                                        return <any>{
                                                                                                            index,
                                                                                                            id,
                                                                                                        };
                                                                                                    },
                                                                                                    hover: monitor =>
                                                                                                    {
                                                                                                        if(monitor.isOver({shallow: true}))
                                                                                                        {
                                                                                                            const [index, parentId] = this.getDropCoordinates(monitor, false);

                                                                                                            if(isBlank(index) || isBlank(parentId))
                                                                                                            {
                                                                                                                return;
                                                                                                            }

                                                                                                            this.bus.setDropPlaceholderPreview(
                                                                                                            {
                                                                                                                index,
                                                                                                                parentId,
                                                                                                                placeholder:
                                                                                                                {
                                                                                                                    height: 0,
                                                                                                                    width: 0
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    }
                                                                                                }, this.initSubscriptions);

    //######################### public properties #########################

    /**
     * Drag source used for dragging component
     */
    public drag: DragSource<any, any> = this.dnd.dragSource('TREE_COMPONENT',
                                                                                    {
                                                                                        beginDrag: () =>
                                                                                        {
                                                                                            this.draggingSvc.setDragging(true);
                                                                                            this.designerElement.nativeElement.classList.add('is-dragged');

                                                                                            return {
                                                                                                dragData: this.dragData,
                                                                                            };
                                                                                        },
                                                                                        canDrag: () => !this.dragDisabled,
                                                                                        endDrag: monitor =>
                                                                                        {
                                                                                            this.designerElement.nativeElement.classList.remove('is-dragged');

                                                                                            //dropped outside of any dropzone
                                                                                            if(monitor.didDrop())
                                                                                            {
                                                                                                const item = monitor.getItem();
                                                                                                const dropResult = monitor.getDropResult();

                                                                                                console.log('dropResult', dropResult, item.dragData);

                                                                                                if(!item)
                                                                                                {
                                                                                                    return;
                                                                                                }

                                                                                                item.dragData.index = dropResult.index;

                                                                                                this.bus.setDropData(
                                                                                                {
                                                                                                    data: item.dragData,
                                                                                                    id: dropResult.id,
                                                                                                });
                                                                                            }

                                                                                            this.bus.setDropPlaceholderPreview(null);
                                                                                            this.draggingSvc.setDragging(false);
                                                                                        },
                                                                                    },
                                                                                    this.initSubscriptions);

    /**
     * Drop zone target that handles drop of component
     */
    public dropzone: DropTarget<any, any> = this.dnd.dropTarget(['TREE_COMPONENT'],
                                                                                        {
                                                                                            canDrop: () => true,
                                                                                            drop: monitor =>
                                                                                            {
                                                                                                const [index, id] = this.getFixedDropCoordinates(monitor, this.canDrop);

                                                                                                return <any>{
                                                                                                    index,
                                                                                                    id
                                                                                                };
                                                                                            },
                                                                                            hover: monitor =>
                                                                                            {
                                                                                                if(monitor.isOver({shallow: true}))
                                                                                                {
                                                                                                    // this._manager.dragOverComponent(this.data?.id);

                                                                                                    if (monitor.canDrop())
                                                                                                    {
                                                                                                        const [index, parentId] = this.getDropCoordinates(monitor, this.canDrop);

                                                                                                        if(isBlank(index) || isBlank(parentId))
                                                                                                        {
                                                                                                            return;
                                                                                                        }

                                                                                                        this.bus.setDropPlaceholderPreview(
                                                                                                        {
                                                                                                            index,
                                                                                                            parentId,
                                                                                                            placeholder:
                                                                                                            {
                                                                                                                height: 0,
                                                                                                                width: 0
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }, this.initSubscriptions);

    //######################### public properties - inputs #########################

    /**
     * Html element that represents dropzone
     */
    @Input()
    public dropzoneElement!: HTMLElement;

    /**
     * Html element that represents children container
     */
    @Input()
    public containerElement!: HTMLElement;

    /**
     * Instance of drag data for this component
     */
    @Input('dndCoreNestedItem')
    public dragData!: any;

    /**
     * Indication whether is drag disabled
     */
    @Input()
    public dragDisabled: boolean = false;

    //######################### public properties - outputs #########################

    /**
     * Occurs when metadata are dropped here
     */
    @Output()
    public dropMetadata: EventEmitter<any> = new EventEmitter<any>();

    //######################### constructor #########################
    constructor(protected dnd: DndService,
                protected designerElement: ElementRef<HTMLElement>,
                protected draggingSvc: DragActiveService,
                protected bus: DndBusService,
                protected zone: NgZone,
                protected injector: Injector,
                @Inject(DOCUMENT) protected document: Document,)
    {
        this.connectDropToContainer();
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        if(!this.dropzoneElement)
        {
            throw new Error('DndCoreDesignerDirective: missing dropzone element!');
        }

        if(!this.containerElement)
        {
            throw new Error('DndCoreDesignerDirective: missing container element!');
        }

        if(!this.dragData)
        {
            throw new Error('DndCoreDesignerDirective: missing drag data!');
        }

        this.initSubscriptions.add(this.bus
                                       .dropDataChange
                                       .pipe(filter((itm: any) => itm.id === this.data?.id))
                                       .subscribe(itm => this.dropMetadata.emit(itm.data)));

        this.initSubscriptions.add(this.bus
                                       .oldDropPlaceholderPreviewChange
                                       .pipe(filter((itm: any) => itm.parentId === this.data?.id))
                                       .subscribe(() =>
                                       {
                                           this.placeholderPreviewElement?.remove();
                                           this.placeholderPreviewElement = null;
                                       }));

        this.initSubscriptions.add(this.bus
                                       .newDropPlaceholderPreviewChange
                                       .pipe(filter((itm: any) => 
                                       {
                                            console.log('show placeholder preview for', itm);
                                            return itm?.parentId === this.data?.id;
                                        }))
                                       .subscribe(this.showPlaceholderPreview));
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this.initSubscriptions.unsubscribe();

        this.placeholderConnection?.unsubscribe();
        this.placeholderConnection = null;

        this.containerConnection?.unsubscribe();
        this.containerConnection = null;
    }

    //######################### protected methods #########################

    /**
     * Gets drop coordinates
     * @param monitor - Monitor containing information about current drag drop state
     * @param canDrop - Indication whether can drop can occur on monitor itself
     */
    protected getDropCoordinates(monitor: DropTargetMonitor<any, any>, canDrop: boolean): [number|null, string|null]
    {
        //can drop in itself// for now drop at index 0
        if(canDrop)
        {
            return this.getDropCoordinatesForChildren(monitor);
        }

        //else get index from descendant
        const [canDropAncestor, ancestorId, id] = this.canDropAncestors(this.data?.id, monitor.getItem()?.dragData.data?.id);

        console.log(id);
        
        //this should not happen
        if(!canDropAncestor || isBlank(ancestorId))
        {
            return [null, null];
        }

        // const parentComponent = this.manager.getComponent(ancestorId);
        // const componentIndex = this.manager.getComponent(id)?.index ?? 0;
        const item = monitor.getItem();

        if(item && isPresent(item.dragData.index))
        {
            //is over itself
            if(item.dragData.data?.id === this.data?.id)
            {
                return [item.dragData.index, item.dragData.parentId ?? ''];
            }
        }

        // if(!parentComponent)
        // {
        //     return [null, null];
        // }

        // return [componentIndex + this.getIndexIncrement(monitor), ancestorId];

        return [null, null];
    }

    /**
     * Gets coordinates calculated for children of this component
     * @param monitor - Monitor containing information about current drag drop state
     */
    protected getDropCoordinatesForChildren(monitor: DropTargetMonitor<any, any>): [number|null, string|null]
    {
        const getHalf = (element: Element) =>
        {
            const rect = element.children[0]?.getBoundingClientRect();
            const position = rect?.y;
            const half = rect?.height / 2;
            
            return position + half;
        };

        console.log(this.containerElement);

        if(!this.containerElement)
        {
            return [null, null];
        }

        let index = 0;
        const offset = monitor.getClientOffset();
        
        if(!offset)
        {
            console.log('nemam offset');
            return [null, null];
        }

        const position = offset.y;

        for(let x = 0; x < this.containerElement.children.length; x++)
        {
            const child = this.containerElement.children[x];

            //do nothing for placeholder
            if(child.classList.contains('drag-placeholder'))
            {
                continue;
            }

            //return index if less than half
            if(position <= getHalf(child))
            {
                return [index, this.data?.id];
            }

            index++;
        }

        return [index, this.data?.id];
    }

    /**
     * Gets fixed drop coordinates
     * @param monitor - Monitor containing information about current drag drop state
     * @param canDrop - Indication whether can drop can occur on monitor itself
     */
    protected getFixedDropCoordinates(monitor: DropTargetMonitor<any, any>, canDrop: boolean): [number|null, string|null]
    {
        const [index, id] = this.getDropCoordinates(monitor, canDrop);
        let usedIndex = index;
        const item = monitor.getItem();

        if(item && isPresent(usedIndex) && isPresent(item.dragData.index))
        {
            //same parent and higher index
            if(id === item.dragData.parentId &&
                usedIndex > item.dragData.index)
            {
                usedIndex--;
            }
        }

        return [usedIndex, id];
    }

    /**
     * Gets index increment
     * @param monitor - Monitor to be used for obtaining information about index
     * @param horizontal - Indication whether are items horizontaly oriented
     */
    protected getIndexIncrement(monitor: DropTargetMonitor<any, any>): number
    {
        const rect = this.dropzoneElement.getBoundingClientRect();
        const offset = monitor.getClientOffset();

        if(!offset)
        {
            return 0;
        }

        const position = offset.y - rect.y;
        const half = rect.height / 2;

        if(position <= half)
        {
            return 0;
        }
        else
        {
            return 1;
        }
    }

    /**
     * Shows placeholder preview at specified location
     * @param preview - Instance of preview data
     */
    @BindThis
    protected showPlaceholderPreview(preview: any): void
    {
        if(!this.containerElement)
        {
            return;
        }

        this.placeholderPreviewElement ??= this.document.createElement('div');
        this.placeholderPreviewElement.classList.add('drag-placeholder');
        this.placeholderPreviewElement.remove();

        this.connectDropToPlaceholder();
        this.containerElement.insertBefore(this.placeholderPreviewElement, this.containerElement.children[preview.index]);
    }

    /**
     * Connects placeholder preview element to placeholder drop
     */
    protected connectDropToPlaceholder(): void
    {
        this.zone.runOutsideAngular(() =>
        {
            this.placeholderConnection?.unsubscribe();

            if(this.placeholderPreviewElement)
            {
                this.placeholderConnection = this.placeholderDrop.connectDropTarget(this.placeholderPreviewElement);
            }
        });
    }

    /**
     * Connects container element to container drop
     */
    protected connectDropToContainer(): void
    {
        this.zone.runOutsideAngular(() =>
        {
            this.containerConnection?.unsubscribe();
            this.containerConnection = this.containerDrop.connectDropTarget(this.designerElement.nativeElement);
        });
    }

    /**
     * Gets indication whether any of ancestors can accept drop, also returns id of that ancestor
     * @param id - Id of component whose parent will be tested, if not specified id of this component will be used
     */
    protected canDropAncestors(id?: string, ancestorId?: string): [boolean, string|null, string]
    {
        if(isBlank(id))
        {
            id = this.data?.id;
        }

        return [true, null, ancestorId];
    }
}