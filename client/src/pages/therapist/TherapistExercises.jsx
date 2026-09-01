import { useState } from 'react';
import Card from '../../components/Card';

export default function TherapistExercises() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJoint, setSelectedJoint] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    name: '',
    targetJoint: 'Knee',
    category: 'Strength & ROM',
    difficulty: 'Beginner',
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldSeconds: 5,
    targetRomAngle: 90,
    instructions: '',
  });

  const [exercises, setExercises] = useState([
    {
      id: 'ex-1',
      name: 'Seated Knee Extension with Quad Hold',
      targetJoint: 'Knee',
      category: 'Strength & ROM',
      difficulty: 'Beginner',
      defaultSets: 3,
      defaultReps: 10,
      defaultHoldSeconds: 5,
      targetRomAngle: 90,
      instructions: 'Sit upright in chair with feet flat. Straighten knee fully until leg is horizontal. Squeeze quadriceps firmly and hold for 5 seconds before lowering slowly.',
      isCustom: false,
    },
    {
      id: 'ex-2',
      name: 'Shoulder Abduction & Flexion in Scapular Plane',
      targetJoint: 'Shoulder',
      category: 'Range of Motion',
      difficulty: 'Moderate',
      defaultSets: 3,
      defaultReps: 12,
      defaultHoldSeconds: 3,
      targetRomAngle: 160,
      instructions: 'Stand tall with arms at sides. Raise arm at a 30-degree angle from body forward plane (scapular plane) up to shoulder height or tolerance. Hold briefly and lower with control.',
      isCustom: false,
    },
    {
      id: 'ex-3',
      name: 'Prone Hamstring Curl with Pelvic Neutral',
      targetJoint: 'Knee',
      category: 'Strength',
      difficulty: 'Beginner',
      defaultSets: 3,
      defaultReps: 10,
      defaultHoldSeconds: 3,
      targetRomAngle: 110,
      instructions: 'Lie prone on mat. Keep hips flat and abdominal muscles engaged. Bend knee to bring heel toward glutes. Hold at top flexion, then return slowly.',
      isCustom: false,
    },
    {
      id: 'ex-4',
      name: 'Cervical Spine Gentle Rotation',
      targetJoint: 'Spine',
      category: 'Stretching',
      difficulty: 'Gentle',
      defaultSets: 2,
      defaultReps: 8,
      defaultHoldSeconds: 5,
      targetRomAngle: 45,
      instructions: 'Sit tall with shoulders relaxed. Slowly rotate head to look over right shoulder until gentle stretch is felt. Hold 5s. Return to center and repeat on left.',
      isCustom: false,
    },
    {
      id: 'ex-5',
      name: 'Straight Leg Raise with Quad Lock',
      targetJoint: 'Knee',
      category: 'Strength & ROM',
      difficulty: 'Beginner',
      defaultSets: 3,
      defaultReps: 10,
      defaultHoldSeconds: 5,
      targetRomAngle: 45,
      instructions: 'Lie supine with non-involved knee bent. Fully tighten quad of straight leg and lift foot 8-12 inches off table. Hold 5s and lower smoothly.',
      isCustom: true,
    },
  ]);

  const handleOpenCreate = () => {
    setEditingExercise(null);
    setFormData({
      name: '',
      targetJoint: 'Knee',
      category: 'Strength & ROM',
      difficulty: 'Beginner',
      defaultSets: 3,
      defaultReps: 10,
      defaultHoldSeconds: 5,
      targetRomAngle: 90,
      instructions: '',
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name,
      targetJoint: exercise.targetJoint,
      category: exercise.category,
      difficulty: exercise.difficulty,
      defaultSets: exercise.defaultSets,
      defaultReps: exercise.defaultReps,
      defaultHoldSeconds: exercise.defaultHoldSeconds,
      targetRomAngle: exercise.targetRomAngle,
      instructions: exercise.instructions,
    });
    setShowCreateModal(true);
  };

  const handleSaveExercise = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingExercise) {
      setExercises(exercises.map((ex) =>
        ex.id === editingExercise.id ? { ...ex, ...formData } : ex
      ));
    } else {
      const newEx = {
        id: `ex-${Date.now()}`,
        ...formData,
        isCustom: true,
      };
      setExercises([newEx, ...exercises]);
    }
    setShowCreateModal(false);
  };

  const handleDeleteExercise = (id) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ex.instructions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJoint = selectedJoint === 'All' || ex.targetJoint === selectedJoint;
    return matchesSearch && matchesJoint;
  });

  return (
    <div className="page-container">
      {/* Page Header with Action Button */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Exercise Management & Library</h1>
          <p className="page-subtitle">
            Curate clinical rehabilitation exercises, motion parameters, default dosing, and patient instructions.
          </p>
        </div>
        <div>
          <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
            + Create New Exercise
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <Card className="filter-card">
        <div className="filter-bar-grid">
          <div className="filter-item search-item">
            <label htmlFor="exercise-search">Search Library</label>
            <input
              id="exercise-search"
              type="text"
              className="form-input"
              placeholder="Search by exercise name, target muscle, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-item">
            <label htmlFor="joint-filter">Target Joint Area</label>
            <select
              id="joint-filter"
              className="form-input"
              value={selectedJoint}
              onChange={(e) => setSelectedJoint(e.target.value)}
            >
              <option value="All">All Joints</option>
              <option value="Knee">Knee</option>
              <option value="Shoulder">Shoulder</option>
              <option value="Spine">Spine</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Exercise Catalog Grid */}
      <div className="exercise-catalog-grid">
        {filteredExercises.map((exercise) => (
          <div key={exercise.id} className="exercise-card-item">
            <div className="exercise-card-header">
              <div className="exercise-badges-row">
                <span className="badge badge-primary">{exercise.targetJoint}</span>
                <span className="badge badge-neutral">{exercise.category}</span>
                <span className="badge badge-success">{exercise.difficulty}</span>
                {exercise.isCustom && <span className="badge badge-warning">Custom</span>}
              </div>
              <h3 className="exercise-card-title">{exercise.name}</h3>
            </div>

            <div className="exercise-card-body">
              <div className="exercise-params-summary">
                <div className="param-item">
                  <span className="param-label">DEFAULT DOSAGE</span>
                  <span className="param-value">{exercise.defaultSets} Sets &times; {exercise.defaultReps} Reps</span>
                </div>
                <div className="param-item">
                  <span className="param-label">HOLD TIME</span>
                  <span className="param-value">{exercise.defaultHoldSeconds}s Hold</span>
                </div>
                <div className="param-item">
                  <span className="param-label">TARGET ROM</span>
                  <span className="param-value">{exercise.targetRomAngle}&deg;</span>
                </div>
              </div>

              <p className="exercise-instructions-preview">
                <strong>Instructions:</strong> {exercise.instructions}
              </p>
            </div>

            <div className="exercise-card-footer">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleOpenEdit(exercise)}
              >
                Edit Parameters
              </button>
              {exercise.isCustom && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm text-danger"
                  onClick={() => handleDeleteExercise(exercise.id)}
                >
                  Archive
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Exercise Modal Form */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingExercise ? 'Edit Exercise Parameters' : 'Create New Exercise'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveExercise} className="modal-form">
              <div className="form-group">
                <label htmlFor="ex-name">Exercise Name *</label>
                <input
                  id="ex-name"
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g., Terminal Knee Extension with Resistance Band"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ex-joint">Target Joint *</label>
                  <select
                    id="ex-joint"
                    className="form-input"
                    value={formData.targetJoint}
                    onChange={(e) => setFormData({ ...formData, targetJoint: e.target.value })}
                  >
                    <option value="Knee">Knee</option>
                    <option value="Shoulder">Shoulder</option>
                    <option value="Spine">Spine</option>
                    <option value="Hip">Hip</option>
                    <option value="Ankle">Ankle</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="ex-category">Movement Category</label>
                  <select
                    id="ex-category"
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Strength & ROM">Strength & ROM</option>
                    <option value="Strength">Strength</option>
                    <option value="Range of Motion">Range of Motion</option>
                    <option value="Stretching">Stretching</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="ex-diff">Difficulty</label>
                  <select
                    id="ex-diff"
                    className="form-input"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="Gentle">Gentle</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ex-sets">Default Sets</label>
                  <input
                    id="ex-sets"
                    type="number"
                    min="1"
                    max="10"
                    className="form-input"
                    value={formData.defaultSets}
                    onChange={(e) => setFormData({ ...formData, defaultSets: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ex-reps">Default Reps</label>
                  <input
                    id="ex-reps"
                    type="number"
                    min="1"
                    max="50"
                    className="form-input"
                    value={formData.defaultReps}
                    onChange={(e) => setFormData({ ...formData, defaultReps: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ex-hold">Hold Duration (seconds)</label>
                  <input
                    id="ex-hold"
                    type="number"
                    min="0"
                    max="60"
                    className="form-input"
                    value={formData.defaultHoldSeconds}
                    onChange={(e) => setFormData({ ...formData, defaultHoldSeconds: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ex-angle">Target ROM Angle (°)</label>
                  <input
                    id="ex-angle"
                    type="number"
                    min="0"
                    max="180"
                    className="form-input"
                    value={formData.targetRomAngle}
                    onChange={(e) => setFormData({ ...formData, targetRomAngle: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ex-instructions">Step-by-Step Instructions *</label>
                <textarea
                  id="ex-instructions"
                  rows={4}
                  required
                  className="form-input form-textarea"
                  placeholder="Describe proper form checkpoints, starting position, and motion execution..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingExercise ? 'Save Changes' : 'Create Exercise'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
