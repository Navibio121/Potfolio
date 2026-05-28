'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, X, Image as ImageIcon, Video, Edit3, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  url: string;
  description?: string;
  type: 'image' | 'video';
  skill_lane?: string;
  industry?: string;
  likes?: number;
  angles?: string[];
  created_at?: string;
}

const SKILL_LANES = [
  { value: '3d-modeling', label: '3D Modeling' },
  { value: 'map-building', label: 'Map Building' },
  { value: 'scripting', label: 'Scripting' },
  { value: 'gui-effects', label: 'GUI / Effects' },
  { value: 'animation', label: 'Animation' },
];

export default function PortfolioManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '', url: '', description: '', type: 'image' as 'image' | 'video',
    skill_lane: '3d-modeling', industry: 'Game Art',
  });
  const [editData, setEditData] = useState<Partial<Project>>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_works')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      const formatted = data.map((work: any) => ({
        ...work,
        industry: work.skill_lane || work.industry || 'Game Art',
        image_url: work.url || work.image_url,
      }));
      setProjects(formatted);
    }
    if (error) console.error('Fetch error:', error);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data, error } = await supabase
      .from('portfolio_works')
      .insert([{ ...newProject, likes: 0 }])
      .select();

    if (error) {
      alert('Error: ' + error.message);
    } else if (data) {
      setProjects([data[0], ...projects]);
      setIsAdding(false);
      setNewProject({ title: '', url: '', description: '', type: 'image', skill_lane: '3d-modeling', industry: 'Game Art' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const { error } = await supabase.from('portfolio_works').delete().eq('id', id);
    if (error) {
      alert('Delete error: ' + error.message);
    } else {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setEditData({ title: project.title, url: project.url, description: project.description, industry: project.industry, skill_lane: project.skill_lane });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    const { error } = await supabase
      .from('portfolio_works')
      .update(editData)
      .eq('id', editingId);

    if (error) {
      alert('Update error: ' + error.message);
    } else {
      setProjects(projects.map(p => p.id === editingId ? { ...p, ...editData } : p));
      setEditingId(null);
    }
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#fff' }}>Manage Portfolio</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>{projects.length} total projects</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          style={{
            padding: '12px 24px', borderRadius: '12px', background: 'var(--accent)', color: '#080808',
            border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 20px rgba(var(--accent-rgb), 0.15)',
          }}
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
            }}
          >
            <motion.div
              initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.95 }}
              style={{
                background: '#0f0f13', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px',
                padding: '2.5rem', width: '100%', maxWidth: '500px', position: 'relative',
              }}
            >
              <button onClick={() => setIsAdding(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={22} />
              </button>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' }}>Add New Project</h3>

              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input required placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} style={inputStyle} />
                <input required placeholder="Image / Video URL" value={newProject.url} onChange={e => setNewProject({ ...newProject, url: e.target.value })} style={inputStyle} />
                <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'none' }} />

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <select value={newProject.type} onChange={e => setNewProject({ ...newProject, type: e.target.value as any })} style={{ ...inputStyle, flex: 1 }}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <select value={newProject.skill_lane} onChange={e => setNewProject({ ...newProject, skill_lane: e.target.value })} style={{ ...inputStyle, flex: 1 }}>
                    {SKILL_LANES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                <input placeholder="Industry (e.g. Game Art)" value={newProject.industry} onChange={e => setNewProject({ ...newProject, industry: e.target.value })} style={inputStyle} />

                <button disabled={saving} type="submit" style={{
                  padding: '14px', borderRadius: '12px', background: 'var(--accent)', color: '#080808',
                  border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Publish</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto' }} />
          <p style={{ marginTop: '1rem' }}>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem', border: '2px dashed rgba(255,255,255,0.1)',
          borderRadius: '16px', color: 'rgba(255,255,255,0.3)',
        }}>
          <ImageIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No projects yet</p>
          <p>Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.map(project => (
            <motion.div
              key={project.id}
              layout
              style={{
                background: '#0f0f13', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px', overflow: 'hidden', position: 'relative',
              }}
            >
              {/* Thumbnail */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', background: '#000', overflow: 'hidden' }}>
                {project.type === 'image' ? (
                  <img src={project.url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e, #0a0a15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Video size={32} color="rgba(255,255,255,0.3)" />
                  </div>
                )}
                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700,
                    background: 'rgba(0,0,0,0.7)', color: '#fff', backdropFilter: 'blur(4px)',
                    textTransform: 'uppercase',
                  }}>
                    {project.type}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '1.25rem' }}>
                {editingId === project.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input value={editData.title || ''} onChange={e => setEditData({ ...editData, title: e.target.value })} style={inputStyle} placeholder="Title" />
                    <input value={editData.url || ''} onChange={e => setEditData({ ...editData, url: e.target.value })} style={inputStyle} placeholder="URL" />
                    <textarea value={editData.description || ''} onChange={e => setEditData({ ...editData, description: e.target.value })} style={{ ...inputStyle, resize: 'none' }} rows={2} placeholder="Description" />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handleSaveEdit} disabled={saving} style={{ ...actionBtn, background: '#1dbf73', flex: 1 }}>
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save</>}
                      </button>
                      <button onClick={() => setEditingId(null)} style={{ ...actionBtn, background: 'rgba(255,255,255,0.1)' }}>
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 style={{ margin: '0 0 0.25rem', color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{project.title}</h4>
                    <p style={{ margin: '0 0 0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                      {project.description || 'No description'}
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: '6px' }}>
                        {project.skill_lane || 'Unset'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: '6px' }}>
                        {project.industry || 'Unset'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#ef4444' }}>
                        ♥ {project.likes ?? 0}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(project)} style={{ ...actionBtn, background: 'rgba(255,255,255,0.06)' }}>
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(project.id)} style={{ ...actionBtn, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                        <Trash2 size={14} /> Delete
                      </button>
                      <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ ...actionBtn, background: 'rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                        <ExternalLink size={14} /> View
                      </a>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff', fontSize: '0.9rem', outline: 'none',
};

const actionBtn: React.CSSProperties = {
  padding: '8px 14px', borderRadius: '8px', border: 'none',
  color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: '6px',
};
