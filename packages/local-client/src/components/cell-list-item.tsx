import './cell-list-item.css';
import { Cell } from '../state';
import ActionBar from './action-bar';
import CodeCell from './code-cell';
import TextEditor from './text-editor';
import React, { EventHandler, MouseEvent, useRef } from 'react';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';

interface CellListItemProps {
  cell: Cell;
  onDragStart: (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => void;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell, onDragStart }) => {
  // const shiftY = useTypedSelector(({ drag }) => {
  //   return drag.dragging?.shiftY;
  // });

  // const onDragCell = (
  //   event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  // ) => {
  //   const target = event.target as Element;
  //   const listCellItem: HTMLElement | null = target.closest(
  //     '.cell-list-item-container'
  //   );

  //   if (!listCellItem) {
  //     return;
  //   }

  //   document.body.style.cursor = 'grabbing';

  //   let moveTo = 0;

  //   listCellItem.classList.add('draggable');

  //   const mockElem = document.createElement('div');
  //   mockElem.style.width = '100%';
  //   mockElem.style.height = `${
  //     Math.floor(listCellItem.getBoundingClientRect().height) - 30
  //   }px`;

  //   listCellItem.insertAdjacentElement('afterend', mockElem);

  //   const onMouseMove = (event: any) => {
  //     moveTo += event.movementY;
  //     listCellItem.style.transform = `translateY(${moveTo}px)`;

  //     const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
  //     const itemBelow = elemBelow?.closest(
  //       '.cell-list-item-container:not(.draggable)'
  //     );

  //     if (itemBelow) {
  //       itemBelow.insertAdjacentElement('afterend', mockElem);
  //     }
  //   };

  //   document.addEventListener('mousemove', onMouseMove);

  //   document.addEventListener('mouseup', (event) => {
  //     moveTo = 0;
  //     mockElem.insertAdjacentElement('afterend', listCellItem);
  //     mockElem.remove();
  //     listCellItem.style.transform = 'unset';
  //     listCellItem.classList.remove('draggable');
  //     document.removeEventListener('mousemove', onMouseMove);
  //     document.body.style.cursor = 'default';
  //   });
  // };

  let child: JSX.Element;

  if (cell.type === 'code') {
    child = <CodeCell cell={cell} />;
  } else {
    child = <TextEditor cell={cell} />;
  }

  return (
    <>
      <div onMouseDown={onDragStart} className="action-bar-wrapper">
        <ActionBar id={cell.id} />
      </div>
      {child}
    </>
  );
};

export default CellListItem;
