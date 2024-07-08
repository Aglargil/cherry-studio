import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SYSTEM_MODELS } from '@renderer/config/models'
import { Model, Provider } from '@renderer/types'
import { uniqBy } from 'lodash'

export interface LlmState {
  providers: Provider[]
  defaultModel: Model
  topicNamingModel: Model
}

const initialState: LlmState = {
  defaultModel: SYSTEM_MODELS.openai[0],
  topicNamingModel: SYSTEM_MODELS.openai[0],
  providers: [
    {
      id: 'openai',
      name: 'OpenAI',
      apiKey: '',
      apiHost: 'https://api.openai.com',
      isSystem: true,
      models: SYSTEM_MODELS.openai.filter((m) => m.defaultEnabled)
    },
    {
      id: 'silicon',
      name: 'Silicon',
      apiKey: '',
      apiHost: 'https://api.siliconflow.cn',
      isSystem: true,
      models: SYSTEM_MODELS.silicon.filter((m) => m.defaultEnabled)
    },
    {
      id: 'deepseek',
      name: 'deepseek',
      apiKey: '',
      apiHost: 'https://api.deepseek.com',
      isSystem: true,
      models: SYSTEM_MODELS.deepseek.filter((m) => m.defaultEnabled)
    },
    {
      id: 'yi',
      name: 'Yi',
      apiKey: '',
      apiHost: 'https://api.lingyiwanwu.com',
      isSystem: true,
      models: SYSTEM_MODELS.yi.filter((m) => m.defaultEnabled)
    },
    {
      id: 'groq',
      name: 'Groq',
      apiKey: '',
      apiHost: 'https://api.groq.com/openai',
      isSystem: true,
      models: SYSTEM_MODELS.groq.filter((m) => m.defaultEnabled)
    }
  ]
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateProvider: (state, action: PayloadAction<Provider>) => {
      state.providers = state.providers.map((p) => (p.id === action.payload.id ? { ...p, ...action.payload } : p))
    },
    addProvider: (state, action: PayloadAction<Provider>) => {
      state.providers.push(action.payload)
    },
    removeProvider: (state, action: PayloadAction<{ id: string }>) => {
      state.providers = state.providers.filter((p) => p.id !== action.payload.id && !p.isSystem)
    },
    addModel: (state, action: PayloadAction<{ providerId: string; model: Model }>) => {
      state.providers = state.providers.map((p) =>
        p.id === action.payload.providerId
          ? {
              ...p,
              models: uniqBy(p.models.concat(action.payload.model), 'id')
            }
          : p
      )
    },
    removeModel: (state, action: PayloadAction<{ providerId: string; model: Model }>) => {
      state.providers = state.providers.map((p) =>
        p.id === action.payload.providerId
          ? {
              ...p,
              models: p.models.filter((m) => m.id !== action.payload.model.id)
            }
          : p
      )
    },
    setDefaultModel: (state, action: PayloadAction<{ model: Model }>) => {
      state.defaultModel = action.payload.model
    },
    setTopicNamingModel: (state, action: PayloadAction<{ model: Model }>) => {
      state.topicNamingModel = action.payload.model
    }
  }
})

export const {
  updateProvider,
  addProvider,
  removeProvider,
  addModel,
  removeModel,
  setDefaultModel,
  setTopicNamingModel
} = settingsSlice.actions

export default settingsSlice.reducer
