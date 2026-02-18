/**
 * Feature bundle types for unified plugin architecture
 * 
 * Feature bundles wrap imported components as first-class OpenCode features.
 * They provide lazy loading, caching, and lifecycle management.
 */

export interface FeatureBundleConfig {
  enabled: boolean
  lazyLoad: boolean
  cacheSize: number
}

export interface FeatureBundle {
  name: string
  description: string
  config: FeatureBundleConfig
  components: BundleComponents
}

export interface BundleComponents {
  commands?: string[]
  skills?: string[]
  agents?: string[]
  mcpServers?: string[]
  hooks?: string[]
}

export interface BundleRegistration {
  bundle: FeatureBundle
  sourcePath: string
  priority: 0 | 1 | 2 | 3 // P0, P1, P2, P3
}
