import { useEffect, useRef } from 'react';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { Cell } from '../state';
import AddCell from './add-cell';
import CellListItem from './cell-list-item';

interface Props {
  cell: Cell;
}

const CellListItemContainer: React.FC<Props> = ({ cell }) => {
  const dragElementRef = useRef<any>();
  const { dragCellStart, dragCell, dragCellEnd, registerElemRect } =
    useActions();

  useEffect(() => {
    console.log(
      'cellListItem',
      cell.id,
      dragElementRef.current.getBoundingClientRect()
    );
    console.log('useEffect');
    registerElemRect(cell.id, dragElementRef.current.getBoundingClientRect());
  }, []);

  // const dragging = useTypedSelector(({ drag }) => {
  //   return drag.dragging?.cellId === cell.id;
  // });

  // const targetCellId = useTypedSelector(({ drag }) => {
  //   return drag.dragging?.targetCellId;
  // });

  const { shiftY, dragging } = useTypedSelector(({ drag }) => {
    return drag.cells[cell.id] || {};
  });

  const isTargetCell = useTypedSelector(({ drag }) => {
    return (
      drag.dragging?.targetCell === cell.id ||
      drag.dragging?.prevTargetCell === cell.id
    );
  });

  const onDragCell = (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    dragCellStart(cell.id, dragElementRef.current.getBoundingClientRect());

    document.body.style.cursor = 'grabbing';

    const initialY = event.clientY;

    const onMouseMove = (event: any) => {
      const shiftY = event.clientY - initialY;

      if (shiftY !== 0) {
        dragCell(cell.id, shiftY);
      }
    };

    const onMouseUp = (event: any) => {
      dragCellEnd(cell.id);

      document.body.style.cursor = 'default';

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousemove', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      ref={dragElementRef}
      className={`cell-list-item-container ${dragging && 'draggable'} ${
        isTargetCell && 'cell-list-item-container_moved'
      }`}
      style={{ transform: `translateY(${shiftY || 0}px)` }}
    >
      <CellListItem cell={cell} onDragStart={onDragCell} />
      <AddCell prevCellId={cell.id} />
    </div>
  );
};

export default CellListItemContainer;
