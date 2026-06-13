import React from 'react';
import { Cloud, fetchSimpleIcons, renderSimpleIcon } from 'react-icon-cloud';

const useIcons = (slugs) => {
  const [icons, setIcons] = React.useState();
  React.useEffect(() => {
    fetchSimpleIcons({ slugs }).then(setIcons);
  }, []);

  if (icons) {
    return Object.values(icons.simpleIcons).map((icon) => renderSimpleIcon({
      icon,
      size: 42,
      aProps: {
        href: undefined,
        target: undefined,
        rel: undefined,
        onClick: (e) => e.preventDefault(),
      },
    }));
  }

  return <a>Loading</a>;
};

const slugs = [
  "javascript", "typescript", "react", "nextdotjs", "html5", "css3", "nodedotjs", 
  "express", "nestjs", "docker", "kubernetes", "git", "github", "gitlab", 
  "linux", "python", "php", "laravel", "mysql", "postgresql", "mongodb", "figma"
];

const DynamicIconCloud = () => {
  const icons = useIcons(slugs);

  return (
    <Cloud
      options={{
        clickToFront: 500,
        depth: 1,
        imageScale: 2,
        initial: [0.1, -0.1],
        outlineColour: '#0000',
        reverse: true,
        tooltip: 'native',
        tooltipDelay: 0,
        wheelZoom: false,
      }}
    >
      {icons}
    </Cloud>
  );
};

export default DynamicIconCloud;
