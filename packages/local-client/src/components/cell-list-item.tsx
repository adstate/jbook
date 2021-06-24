import './cell-list-item.css';
import { Cell } from '../state';
import ActionBar from './action-bar';
import CodeCell from './code-cell';
import TextEditor from './text-editor';
import React, { EventHandler, MouseEvent } from 'react';

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  const onDragCell = (
    event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    const target = event.target as Element;
    const listCellItem: HTMLElement | null = target.closest('.cell-list-item');

    if (!listCellItem) {
      return;
    }

    let shiftY = event.clientY - listCellItem.getBoundingClientRect().top;

    listCellItem.classList.add('draggable');

    const onMouseMove = (event: any) => {
      console.log(event.pageY);
      listCellItem.style.top = event.pageY - shiftY + 'px';
    };

    document.addEventListener('mousemove', onMouseMove);

    document.addEventListener('mouseup', (event) => {
      document.removeEventListener('mousemove', onMouseMove);
    });
  };

  let child: JSX.Element;

  if (cell.type === 'code') {
    child = (
      <>
        <div className="action-bar-wrapper">
          <ActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  } else {
    child = (
      <>
        <ActionBar id={cell.id} />
        <TextEditor cell={cell} />
      </>
    );
  }

  return (
    <div onMouseDown={onDragCell} className="cell-list-item">
      {child}
    </div>
  );
};

export default CellListItem;
