import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useRef } from 'react';

import { usePointer } from '@wsh-2025/client/src/features/layout/hooks/usePointer';
import { useDuration } from '@wsh-2025/client/src/pages/episode/hooks/useDuration';

const SEEK_THUMBNAIL_WIDTH = 160;
const MIN_LEFT = SEEK_THUMBNAIL_WIDTH / 2;

interface Props {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

export const SeekThumbnail = ({ episode }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const duration = useDuration();
  const [relativeX, setRelativeX] = useState(0);
  const [pointedTime, setPointedTime] = useState(0);
  const [maxLeft, setMaxLeft] = useState(0);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;

    const handleMouseOver = (event) => {
      const elementRect = parent.getBoundingClientRect();
      const pointerX = event.clientX;

      setRelativeX(pointerX - elementRect.left);
      setMaxLeft(elementRect.width - SEEK_THUMBNAIL_WIDTH / 2);

      const percentage = Math.max(0, Math.min(relativeX / elementRect.width, 1));
      setPointedTime(duration * percentage);
    };

    parent.addEventListener('mouseover', handleMouseOver);
    return () => {
      parent.removeEventListener('mouseover', handleMouseOver);
    };
  }, [])

  return (
    <div
      ref={ref}
      className="absolute h-[90px] w-[160px] bg-[size:auto_100%] bottom-0 translate-x-[-50%]"
      style={{
        backgroundPositionX: -1 * SEEK_THUMBNAIL_WIDTH * Math.floor(pointedTime),
        left: Math.max(MIN_LEFT, Math.min(relativeX, maxLeft)),
        backgroundImage: `url(/public/previews/${episode.streamId}.jpeg)`,
      }}
    />
  );
};
