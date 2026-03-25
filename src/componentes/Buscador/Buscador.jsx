import React, { useEffect, useMemo, useState } from "react";
import EventoCard from "../Calendario/EventoCard";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function parseTags(tagsJson) {
  if (!tagsJson) return [];
  if (Array.isArray(tagsJson)) return tagsJson;

  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizarEvento(fiesta) {
  return {
    ...fiesta,
    start: fiesta.start_at ? new Date(fiesta.start_at) : null,
    end: fiesta.end_at ? new Date(fiesta.end_at) : null,
    tags: parseTags(fiesta.tags_json),
  };
}

function BuscadorFiestas() {
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categoriaDetalle, setCategoriaDetalle] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [soloFuturos, setSoloFuturos] = useState(true);
  const [sort, setSort] = useState("start_at_asc");

  const [eventos, setEventos] = useState([]);
  const [filtros, setFiltros] = useState({
    categorias: [],
    categoriasDetalle: [],
    municipios: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const eventosNormalizados = useMemo(
    () => eventos.map(normalizarEvento),
    [eventos]
  );

  useEffect(() => {
    cargarFiltros();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      buscarEventos();
    }, 400);

    return () => clearTimeout(timer);
  }, [q, categoria, categoriaDetalle, fechaDesde, fechaHasta, soloFuturos, sort]);

  const cargarFiltros = async () => {
    try {
      const res = await fetch(`${API_URL}/api/fiestas/filtros`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "No se pudieron cargar los filtros");
      }

      setFiltros(data.filtros || {
        categorias: [],
        categoriasDetalle: [],
        municipios: [],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const buscarEventos = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (q.trim()) params.append("q", q.trim());
      if (categoria) params.append("categoria", categoria);
      if (categoriaDetalle) params.append("categoria_detalle", categoriaDetalle);
      if (fechaDesde) params.append("fechaDesde", fechaDesde);
      if (fechaHasta) params.append("fechaHasta", fechaHasta);
      params.append("soloFuturos", String(soloFuturos));
      params.append("sort", sort);
      params.append("page", "1");
      params.append("limit", "12");

      const res = await fetch(`${API_URL}/api/fiestas/buscar?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Error al buscar fiestas");
      }

      setEventos(Array.isArray(data.eventos) ? data.eventos : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al buscar fiestas");
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setQ("");
    setCategoria("");
    setCategoriaDetalle("");
    setFechaDesde("");
    setFechaHasta("");
    setSoloFuturos(true);
    setSort("start_at_asc");
  };

  return (
    <section className="buscador-fiestas-wrap">
      <div className="contenedor-buscador">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por evento, municipio o dirección..."
          className="input-buscador"
        />
      </div>

      <div className="filtros-buscador" style={styles.filtros}>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={styles.control}
        >
          <option value="">Todas las categorías</option>
          {filtros.categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={categoriaDetalle}
          onChange={(e) => setCategoriaDetalle(e.target.value)}
          style={styles.control}
        >
          <option value="">Todos los tipos</option>
          {filtros.categoriasDetalle.map((subcat) => (
            <option key={subcat} value={subcat}>
              {subcat}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
          style={styles.control}
        />

        <input
          type="date"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
          style={styles.control}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={styles.control}
        >
          <option value="start_at_asc">Próximos primero</option>
          <option value="start_at_desc">Más lejanos primero</option>
          <option value="created_at_desc">Más recientes</option>
          <option value="titulo_asc">Título A-Z</option>
          <option value="titulo_desc">Título Z-A</option>
        </select>

        <label style={styles.checkWrap}>
          <input
            type="checkbox"
            checked={soloFuturos}
            onChange={(e) => setSoloFuturos(e.target.checked)}
          />
          Solo futuros
        </label>

        <button type="button" onClick={limpiarFiltros} style={styles.btnLimpiar}>
          Limpiar
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {loading && <p>Cargando fiestas...</p>}

        {!loading && error && <p>{error}</p>}

        {!loading && !error && eventosNormalizados.length === 0 && (
          <p>No se encontraron fiestas con esos filtros.</p>
        )}

        {!loading && !error && eventosNormalizados.length > 0 && (
          <div style={styles.lista}>
            {eventosNormalizados.map((evento) => (
              <EventoCard key={evento.id} evento={evento} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const styles = {
  filtros: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
    alignItems: "center",
  },
  control: {
    minHeight: 40,
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #d9d9d9",
    background: "#fff",
  },
  checkWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minHeight: 40,
  },
  btnLimpiar: {
    minHeight: 40,
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  },
  lista: {
    display: "grid",
    gap: 16,
  },
};

export default BuscadorFiestas;