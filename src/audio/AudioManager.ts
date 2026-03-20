import * as Tone from 'tone';

type NoteCallback = (time: number, note: string | number, velocity: number) => void;

class AudioManager {
  private isInitialized = false;
  private isPlaying = false;
  private synths: Record<string, any> = {};
  private parts: Record<string, Tone.Part> = {};
  private callbacks: Record<string, Set<NoteCallback>> = {};

  constructor() {
    this.callbacks = {
      rock: new Set(),
      bass: new Set(),
      jelly: new Set(),
      plant: new Set(),
      wubbox: new Set(),
      bird: new Set(),
      furcorn: new Set(),
    };
  }

  async init() {
    if (this.isInitialized) return;
    await Tone.start();
    Tone.Transport.bpm.value = 140; // Classic MSM tempo feel

    // Rock (Noggin - Bongo/Percussion)
    this.synths.rock = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      octaves: 2,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
    }).toDestination();
    this.synths.rock.volume.value = 2;

    // Bass (Mammott - Deep Vocal "Bum")
    const bassFilter = new Tone.Filter(400, "lowpass").toDestination();
    this.synths.bass = new Tone.FMSynth({
      harmonicity: 2,
      modulationIndex: 2,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.5 },
      modulation: { type: 'triangle' },
      modulationEnvelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.5 },
    }).connect(bassFilter);
    this.synths.bass.volume.value = 6;

    // Jelly (Toe Jammer - Watery "Doo")
    const jellyVibrato = new Tone.Vibrato(5, 0.1).toDestination();
    this.synths.jelly = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.8 },
    }).connect(jellyVibrato);
    this.synths.jelly.volume.value = 2;

    // Plant (Potbelly - Plucky "Bap")
    this.synths.plant = new Tone.PolySynth(Tone.AMSynth, {
      harmonicity: 1.5,
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.2 },
      modulation: { type: 'square' },
      modulationEnvelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination();
    this.synths.plant.volume.value = 0;

    // Wubbox (Dubstep Wub)
    const wubboxDistortion = new Tone.Distortion(0.8).toDestination();
    const wubboxFilter = new Tone.AutoFilter("4n").connect(wubboxDistortion).start();
    this.synths.wubbox = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.5 },
      filterEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.5, baseFrequency: 100, octaves: 4 }
    }).connect(wubboxFilter);
    this.synths.wubbox.volume.value = -2;

    // Bird (Tweedle - High pitched "La")
    this.synths.bird = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.3, release: 0.5 },
    }).toDestination();
    this.synths.bird.volume.value = -4;

    // Furcorn (La la la)
    const furcornVibrato = new Tone.Vibrato(6, 0.2).toDestination();
    this.synths.furcorn = new Tone.FMSynth({
      harmonicity: 1.5,
      modulationIndex: 1,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.8 },
      modulation: { type: 'sine' },
      modulationEnvelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.8 },
    }).connect(furcornVibrato);
    this.synths.furcorn.volume.value = 0;

    this.setupSequences();
    this.isInitialized = true;
  }

  private setupSequences() {
    // Quirky MSM-style composition (8-bar loop)
    
    // Rock (Noggin) - Syncopated bongo rhythm
    const rockNotes = [
      { time: '0:0:0', note: 'G2', velocity: 1 },
      { time: '0:0:2', note: 'C3', velocity: 0.6 },
      { time: '0:1:2', note: 'G2', velocity: 0.8 },
      { time: '0:2:0', note: 'C3', velocity: 1 },
      { time: '0:3:0', note: 'G2', velocity: 0.8 },
      { time: '0:3:2', note: 'C3', velocity: 0.6 },
      
      { time: '1:0:0', note: 'G2', velocity: 1 },
      { time: '1:0:2', note: 'C3', velocity: 0.6 },
      { time: '1:1:2', note: 'G2', velocity: 0.8 },
      { time: '1:2:0', note: 'C3', velocity: 1 },
      { time: '1:3:0', note: 'G2', velocity: 1 },
      { time: '1:3:2', note: 'G2', velocity: 1 },
    ];
    // Duplicate for 8 bars
    const fullRockNotes = [];
    for(let i=0; i<4; i++) {
      rockNotes.forEach(n => {
        const parts = n.time.split(':');
        fullRockNotes.push({ ...n, time: `${parseInt(parts[0]) + i*2}:${parts[1]}:${parts[2]}` });
      });
    }

    this.parts.rock = new Tone.Part((time, value) => {
      this.synths.rock.triggerAttackRelease(value.note, '16n', time, value.velocity);
      this.triggerCallbacks('rock', time, value.note, value.velocity);
    }, fullRockNotes).start(0);
    this.parts.rock.loop = true;
    this.parts.rock.loopEnd = '8m';

    // Bass (Mammott) - "Bum, bum bum, bum"
    const bassNotes = [
      { time: '0:0:0', note: 'C2', duration: '4n', velocity: 1 },
      { time: '0:2:0', note: 'C2', duration: '8n', velocity: 1 },
      { time: '0:2:2', note: 'C2', duration: '8n', velocity: 1 },
      { time: '0:3:2', note: 'C2', duration: '4n', velocity: 1 },
      
      { time: '1:0:0', note: 'G1', duration: '4n', velocity: 1 },
      { time: '1:2:0', note: 'G1', duration: '8n', velocity: 1 },
      { time: '1:2:2', note: 'G1', duration: '8n', velocity: 1 },
      { time: '1:3:2', note: 'G1', duration: '4n', velocity: 1 },
      
      { time: '2:0:0', note: 'F1', duration: '4n', velocity: 1 },
      { time: '2:2:0', note: 'F1', duration: '8n', velocity: 1 },
      { time: '2:2:2', note: 'F1', duration: '8n', velocity: 1 },
      { time: '2:3:2', note: 'F1', duration: '4n', velocity: 1 },
      
      { time: '3:0:0', note: 'C2', duration: '4n', velocity: 1 },
      { time: '3:2:0', note: 'G1', duration: '4n', velocity: 1 },
    ];
    // Duplicate for 8 bars
    const fullBassNotes = [];
    for(let i=0; i<2; i++) {
      bassNotes.forEach(n => {
        const parts = n.time.split(':');
        fullBassNotes.push({ ...n, time: `${parseInt(parts[0]) + i*4}:${parts[1]}:${parts[2]}` });
      });
    }

    this.parts.bass = new Tone.Part((time, value) => {
      this.synths.bass.triggerAttackRelease(value.note, value.duration, time, value.velocity);
      this.triggerCallbacks('bass', time, value.note, value.velocity);
    }, fullBassNotes).start(0);
    this.parts.bass.loop = true;
    this.parts.bass.loopEnd = '8m';

    // Jelly (Toe Jammer) - "Doo, doo doo"
    const jellyNotes = [
      { time: '0:0:0', notes: ['C4', 'E4'], duration: '4n', velocity: 0.8 },
      { time: '0:1:2', notes: ['C4', 'E4'], duration: '8n', velocity: 0.6 },
      { time: '0:2:0', notes: ['D4', 'F4'], duration: '4n', velocity: 0.8 },
      
      { time: '1:0:0', notes: ['B3', 'D4'], duration: '4n', velocity: 0.8 },
      { time: '1:1:2', notes: ['B3', 'D4'], duration: '8n', velocity: 0.6 },
      { time: '1:2:0', notes: ['C4', 'E4'], duration: '4n', velocity: 0.8 },
      
      { time: '2:0:0', notes: ['A3', 'C4'], duration: '4n', velocity: 0.8 },
      { time: '2:1:2', notes: ['A3', 'C4'], duration: '8n', velocity: 0.6 },
      { time: '2:2:0', notes: ['G3', 'B3'], duration: '4n', velocity: 0.8 },
      
      { time: '3:0:0', notes: ['C4', 'E4'], duration: '2n', velocity: 0.8 },
    ];
    const fullJellyNotes = [];
    for(let i=0; i<2; i++) {
      jellyNotes.forEach(n => {
        const parts = n.time.split(':');
        fullJellyNotes.push({ ...n, time: `${parseInt(parts[0]) + i*4}:${parts[1]}:${parts[2]}` });
      });
    }

    this.parts.jelly = new Tone.Part((time, value) => {
      this.synths.jelly.triggerAttackRelease(value.notes, value.duration, time, value.velocity);
      this.triggerCallbacks('jelly', time, value.notes[0], value.velocity);
    }, fullJellyNotes).start(0);
    this.parts.jelly.loop = true;
    this.parts.jelly.loopEnd = '8m';

    // Plant (Potbelly) - "Bap, ba dap, bap"
    const plantNotes = [
      { time: '4:0:0', note: 'C5', duration: '8n', velocity: 1 },
      { time: '4:0:2', note: 'G4', duration: '8n', velocity: 0.8 },
      { time: '4:1:0', note: 'C5', duration: '8n', velocity: 1 },
      { time: '4:2:0', note: 'E5', duration: '8n', velocity: 1 },
      { time: '4:3:0', note: 'D5', duration: '8n', velocity: 0.8 },
      
      { time: '5:0:0', note: 'B4', duration: '8n', velocity: 1 },
      { time: '5:0:2', note: 'G4', duration: '8n', velocity: 0.8 },
      { time: '5:1:0', note: 'B4', duration: '8n', velocity: 1 },
      { time: '5:2:0', note: 'D5', duration: '8n', velocity: 1 },
      { time: '5:3:0', note: 'C5', duration: '8n', velocity: 0.8 },
      
      { time: '6:0:0', note: 'A4', duration: '8n', velocity: 1 },
      { time: '6:0:2', note: 'E4', duration: '8n', velocity: 0.8 },
      { time: '6:1:0', note: 'A4', duration: '8n', velocity: 1 },
      { time: '6:2:0', note: 'C5', duration: '8n', velocity: 1 },
      { time: '6:3:0', note: 'B4', duration: '8n', velocity: 0.8 },
      
      { time: '7:0:0', note: 'G4', duration: '4n', velocity: 1 },
      { time: '7:1:0', note: 'G4', duration: '8n', velocity: 1 },
      { time: '7:2:0', note: 'C5', duration: '4n', velocity: 1 },
    ];

    this.parts.plant = new Tone.Part((time, value) => {
      this.synths.plant.triggerAttackRelease(value.note, value.duration, time, value.velocity);
      this.triggerCallbacks('plant', time, value.note, value.velocity);
    }, plantNotes).start(0);
    this.parts.plant.loop = true;
    this.parts.plant.loopEnd = '8m';

    // Wubbox - Drops on bar 5
    const wubboxNotes = [
      { time: '4:0:0', note: 'C1', duration: '4n', velocity: 1 },
      { time: '4:1:0', note: 'C2', duration: '8n', velocity: 1 },
      { time: '4:1:2', note: 'C1', duration: '8n', velocity: 1 },
      { time: '4:2:0', note: 'C1', duration: '4n', velocity: 1 },
      
      { time: '5:0:0', note: 'G1', duration: '4n', velocity: 1 },
      { time: '5:1:0', note: 'G2', duration: '8n', velocity: 1 },
      { time: '5:1:2', note: 'G1', duration: '8n', velocity: 1 },
      { time: '5:2:0', note: 'G1', duration: '4n', velocity: 1 },
      
      { time: '6:0:0', note: 'F1', duration: '4n', velocity: 1 },
      { time: '6:1:0', note: 'F2', duration: '8n', velocity: 1 },
      { time: '6:1:2', note: 'F1', duration: '8n', velocity: 1 },
      { time: '6:2:0', note: 'F1', duration: '4n', velocity: 1 },
      
      { time: '7:0:0', note: 'C1', duration: '4n', velocity: 1 },
      { time: '7:1:0', note: 'C2', duration: '8n', velocity: 1 },
      { time: '7:2:0', note: 'G1', duration: '4n', velocity: 1 },
    ];

    this.parts.wubbox = new Tone.Part((time, value) => {
      this.synths.wubbox.triggerAttackRelease(value.note, value.duration, time, value.velocity);
      this.triggerCallbacks('wubbox', time, value.note, value.velocity);
    }, wubboxNotes).start(0);
    this.parts.wubbox.loop = true;
    this.parts.wubbox.loopEnd = '8m';

    // Bird (Tweedle)
    const birdNotes = [
      { time: '0:0:0', note: 'G5', duration: '8n', velocity: 0.8 },
      { time: '0:0:2', note: 'E5', duration: '8n', velocity: 0.6 },
      { time: '0:1:0', note: 'C5', duration: '4n', velocity: 0.8 },
      { time: '0:2:0', note: 'G5', duration: '8n', velocity: 0.8 },
      { time: '0:2:2', note: 'E5', duration: '8n', velocity: 0.6 },
      { time: '0:3:0', note: 'C5', duration: '4n', velocity: 0.8 },
    ];
    const fullBirdNotes = [];
    for(let i=0; i<4; i++) {
      birdNotes.forEach(n => {
        const parts = n.time.split(':');
        fullBirdNotes.push({ ...n, time: `${parseInt(parts[0]) + i*2}:${parts[1]}:${parts[2]}` });
      });
    }
    this.parts.bird = new Tone.Part((time, value) => {
      this.synths.bird.triggerAttackRelease(value.note, value.duration, time, value.velocity);
      this.triggerCallbacks('bird', time, value.note, value.velocity);
    }, fullBirdNotes).start(0);
    this.parts.bird.loop = true;
    this.parts.bird.loopEnd = '8m';

    // Furcorn
    const furcornNotes = [
      { time: '2:0:0', note: 'C4', duration: '4n', velocity: 1 },
      { time: '2:1:0', note: 'E4', duration: '4n', velocity: 1 },
      { time: '2:2:0', note: 'G4', duration: '2n', velocity: 1 },
      { time: '3:0:0', note: 'A4', duration: '4n', velocity: 1 },
      { time: '3:1:0', note: 'G4', duration: '4n', velocity: 1 },
      { time: '3:2:0', note: 'E4', duration: '2n', velocity: 1 },
    ];
    const fullFurcornNotes = [];
    for(let i=0; i<2; i++) {
      furcornNotes.forEach(n => {
        const parts = n.time.split(':');
        fullFurcornNotes.push({ ...n, time: `${parseInt(parts[0]) + i*4}:${parts[1]}:${parts[2]}` });
      });
    }
    this.parts.furcorn = new Tone.Part((time, value) => {
      this.synths.furcorn.triggerAttackRelease(value.note, value.duration, time, value.velocity);
      this.triggerCallbacks('furcorn', time, value.note, value.velocity);
    }, fullFurcornNotes).start(0);
    this.parts.furcorn.loop = true;
    this.parts.furcorn.loopEnd = '8m';
  }

  subscribe(type: string, callback: NoteCallback) {
    if (!this.callbacks[type]) {
      this.callbacks[type] = new Set();
    }
    this.callbacks[type].add(callback);
    return () => {
      this.callbacks[type].delete(callback);
    };
  }

  private triggerCallbacks(type: string, time: number, note: string | number, velocity: number) {
    Tone.Draw.schedule(() => {
      this.callbacks[type]?.forEach((cb) => cb(time, note, velocity));
    }, time);
  }

  togglePlay() {
    if (!this.isInitialized) return;
    if (this.isPlaying) {
      Tone.Transport.pause();
    } else {
      Tone.Transport.start();
    }
    this.isPlaying = !this.isPlaying;
  }

  setMute(type: string, muted: boolean) {
    if (this.synths[type]) {
      const defaultVolumes: Record<string, number> = {
        rock: 2, bass: 6, jelly: 2, plant: 0, wubbox: -2, bird: -4, furcorn: 0
      };
      this.synths[type].volume.value = muted ? -Infinity : (defaultVolumes[type] ?? 0);
    }
  }

  updateActiveMonsters(activeTypes: string[], mutedTracks: Record<string, boolean>) {
    if (!this.isInitialized) return;
    const allTypes = ['rock', 'bass', 'jelly', 'plant', 'wubbox', 'bird', 'furcorn'];
    allTypes.forEach(type => {
      const isPresent = activeTypes.includes(type);
      const isMutedByUser = mutedTracks[type];
      const shouldMute = !isPresent || isMutedByUser;
      this.setMute(type, shouldMute);
    });
  }
}

export const audioManager = new AudioManager();
