import { Badge, Tooltip } from 'flowbite-react';
import { motion } from 'framer-motion';

export const CombatStats = ({ player, isMobile }) => {
  const { fleet } = player;

  if (!fleet) {
    return <></>;
  }

  return (
    <div className="flex flex-wrap my-2 mt-4 justify-between">
      {/* show a list with damaged or not ships */}
      {fleet.map((ship, index) => {
        return (
          <motion.div
            key={player.name + ship.name + index}
            initial={{ x: '0' }}
            whileHover={{ scale: 1.1 }}
          >
            <Tooltip
              placement={isMobile ? 'top' : 'bottom'}
              content={`${isMobile ? ship.name.toUpperCase() : ''} ${
                ship.isDamaged ? 'Damaged' : 'Afloat'
              } ${ship.isSunk ? '& Sunk' : ''}`}
            >
              <div
                className={`${ship.color} capitalize rounded p-1 font-semibold min-h-20`}
              >
                {isMobile ? `${ship.name.charAt(0)}` : ship.name}
                {ship.isSunk && '❌'}
                <div className="flex justify-around">
                  {ship.isDamaged ? (
                    <Badge className="w-2 h-2" color="warning" />
                  ) : null}
                  {ship.isSunk ? (
                    <Badge className="w-2 h-2" color="failure" />
                  ) : null}
                </div>
              </div>
            </Tooltip>
          </motion.div>
        );
      })}
    </div>
  );
};
