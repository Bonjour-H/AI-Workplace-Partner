import React from 'react';

function DeletePersonaConfirmModal({ open, personaName, onCancel, onConfirm }) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-persona-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="delete-persona-title"
          className="text-lg font-bold text-slate-800"
        >
          确认删除？
        </h2>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          {personaName
            ? `将删除「${personaName}」及其相关数据，此操作不可恢复。`
            : '将删除该人物及其相关数据，此操作不可恢复。'}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            确定删除
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePersonaConfirmModal;
