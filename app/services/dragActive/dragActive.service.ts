import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

/**
 * Service that holds information whether is currently drag active
 */
@Injectable()
export class DragActiveService
{
    //######################### private fields #########################
    
    /**
     * Current dragging value
     */
    private _dragging: boolean = false;
    
    /**
     * Used for emitting dragging changes
     */
    private _draggingChange: Subject<void> = new Subject<void>();
    
    //######################### public properties #########################
    
    /**
     * Gets current dragging value
     */
    public get dragging(): boolean
    {
        return this._dragging;
    }
    
    /**
     * Occurs when dragging changes
     */
    public get draggingChange(): Observable<void>
    {
        return this._draggingChange.asObservable();
    }
    
    //######################### public methods #########################
    
    /**
     * Sets dragging new value
     * @param dragging - Value of dragging that changed
     */
    public setDragging(dragging: boolean): void
    {
        if(this._dragging == dragging)
        {
            return;
        }
    
        this._dragging = dragging;
        this._draggingChange.next();
    }
}