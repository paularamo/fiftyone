import { useTheme } from "@fiftyone/components";
import { useHelper } from "@react-three/drei";
import { folder, useControls } from "leva";
import { useCallback, useMemo, useState } from "react";
import {
  DirectionalLightHelper,
  type Light,
  PointLightHelper,
  SpotLightHelper,
} from "three";
import { PANEL_ORDER_LIGHTS } from "../constants";
import { useFo3dContext } from "../fo3d/context";
import type { FoScene } from "./use-fo3d";

export const getIntensityKey = (lightName: string) => `${lightName}Intensity`;
export const getColorKey = (lightName: string) => `${lightName}Color`;
export const getPositionKey = (lightName: string) => `${lightName}Position`;
export const getDecayKey = (lightName: string) => `${lightName}Decay`;

type LightHelperConfig = {
  type: Omit<FoScene["lights"][number]["_type"], "AmbientLight">;
  lightIndex: number;
};

export const useLightControls = (
  lights: FoScene["lights"],
  editingLightRef: React.MutableRefObject<Light>
) => {
  const { sceneBoundingBox } = useFo3dContext();

  const [lightHelperConfig, setLightHelperConfig] =
    useState<LightHelperConfig | null>(null);

  const onLightPositionEditStart = useCallback(
    (type: string, lightIndex: number) => {
      setLightHelperConfig({
        type,
        lightIndex,
      });
    },
    []
  );

  const onLightPositionEditEnd = useCallback(() => {
    setLightHelperConfig(null);
  }, []);

  const lightLevaControls = useMemo(() => {
    const config = {};

    for (let i = 0; i < lights.length; i++) {
      const light = lights[i];
      const intensityKey = getIntensityKey(light.name);
      const colorKey = getColorKey(light.name);
      const positionKey = getPositionKey(light.name);
      const decayKey = getDecayKey(light.name);

      config[intensityKey] = {
        value: light.intensity,
        min: 0,
        max: 1,
        step: 0.01,
        label: `${light.name} intensity`,
      };

      config[colorKey] = {
        value: light.color,
        label: `${light.name} color`,
        render: () => light._type === "AmbientLight",
      };

      if (light._type !== "AmbientLight") {
        config[positionKey] = {
          value: light.position,
          label: `${light.name} position`,
          step: 1,
          onEditStart: () => {
            onLightPositionEditStart(light._type, i);
          },
          onEditEnd: onLightPositionEditEnd,
        };
      }

      if (light._type === "SpotLight") {
        config[decayKey] = {
          value: light.decay ?? 2,
          min: 0,
          max: 4,
          step: 0.1,
          onEditStart: () => {
            onLightPositionEditStart(light._type, i);
          },
          onEditEnd: onLightPositionEditEnd,
          label: `${light.name} decay`,
        };
      }
    }

    return config;
  }, [lights, onLightPositionEditEnd, onLightPositionEditStart]);

  const [lightConfig] = useControls(
    () => ({
      Lights: folder(lightLevaControls, {
        order: PANEL_ORDER_LIGHTS,
        collapsed: true,
      }),
    }),
    [lightLevaControls]
  );

  const lightHelperSize = useMemo(() => {
    if (!sceneBoundingBox) {
      return 0;
    }

    const { min, max } = sceneBoundingBox;
    const diagonal = min.distanceTo(max);
    return diagonal / 10;
  }, [sceneBoundingBox]);

  const theme = useTheme();
  const helperConfig = useMemo(() => {
    if (!lightHelperConfig) {
      return null;
    }

    const { type } = lightHelperConfig;

    switch (type) {
      case "DirectionalLight":
        return [DirectionalLightHelper, lightHelperSize, theme.primary.main];
      case "SpotLight":
        return [SpotLightHelper, theme.primary.main];
      case "PointLight":
        return [PointLightHelper, lightHelperSize, theme.primary.main];
      default:
        return null;
    }
  }, [lightHelperConfig, lightHelperSize]);

  useHelper(
    helperConfig ? editingLightRef : false,
    // @ts-ignore
    helperConfig?.at(0) ?? DirectionalLightHelper,
    // @ts-ignore
    ...(helperConfig ?? []).slice(1)
  );

  return [lightConfig, lightHelperConfig] as const;
};
