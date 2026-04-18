export function Card({ children, titulo, accion, sinPadding = false, className = '' }) {
  return (
    <div className={`
      bg-white rounded-xl border border-gray-100
      shadow-sm w-full overflow-hidden
      ${className}
    `}>

      {(titulo || accion) && (
        <div className="flex items-center justify-between px-3 py-2.5
                        border-b border-gray-50">
          {titulo && (
            <h3 className="text-xs font-semibold text-gray-700 uppercase
                           tracking-wide">
              {titulo}
            </h3>
          )}
          {accion && <div className="flex-shrink-0">{accion}</div>}
        </div>
      )}

      <div className={sinPadding ? '' : 'p-3'}>
        {children}
      </div>

    </div>
  );
}
