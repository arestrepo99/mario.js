import cv2
import numpy as np
import matplotlib.pyplot as plt


class Tile:

    def __init__(self, array):
        self.array = array
    
    def removeBackground(self, background_color):
        self.mask = self.array != background_color
        self.array[~self.mask] = 225
        return self

    def equal(self, block):
        if self.mask is not None:
            return np.array_equal(self.array[self.mask], block.array[self.mask])
        else:
            return np.array_equal(self.array, block.array)

    def __eq__(self, other):
        return np.array_equal(self.array, other.array)

    def __repr__(self):
        plt.figure(figsize=(1,1))
        plt.imshow(cv2.cvtColor(self.array, cv2.COLOR_BGR2RGB))
        return ''

    
class TileMap:

    def __init__(self, img, pos_dict):
        self.img = img
        # Add alpha channel
        if self.img.shape[2] == 3:
            self.img = np.dstack((self.img, np.ones((self.img.shape[0], self.img.shape[1]), dtype=self.img.dtype)*255))
        self.pos_dict = {k: v if isinstance(v, dict) else {'default': v} for k,v in pos_dict.items()}
        self.shape = img.shape[1] // 16, img.shape[0] // 16
        self.tile_dict = {k: self.get_tile(k) for k in pos_dict.keys()}


    def getBlock(self, x,y):
        return Tile(self.img[y*16:y*16+16,x*16:x*16+16])

    def get_tile(self, key):
        return {k: self.getBlock(*v) for k,v in self.pos_dict[key].items()}
        
    def __getitem__(self, key):
        return self.tile_dict[key]

    def __setitem__(self, key, value):
        # Change tile_dict
        self.tile_dict[key] = value
        # Change img
        for k, (x,y) in self.pos_dict[key].items():
            self.img[y*16:y*16+16,x*16:x*16+16] = value[k].array
    
    def __repr__(self) -> str:
        grid_size = self.img.shape[0] // 16
        plt.imshow(cv2.cvtColor(self.img, cv2.COLOR_BGR2RGB))
        plt.xticks(np.arange(0, grid_size*16, 16), np.arange(0, grid_size, 1))
        plt.yticks(np.arange(0, grid_size*16, 16), np.arange(0, grid_size, 1))
        plt.pause(0.01)
        return ''
            


class Map:
    def __init__(self, img, flipy=False):
        self.img = img
        self.shape = img.shape[1] // 16, img.shape[0] // 16
        self.flipy = flipy
        self.feature_array()

    def getBlock(self, x,y):
        # Flip y
        if self.flipy:
            y = self.shape[1] - y - 1
        # y = self.shape[1] - y
        # y = self.shape[1] - y
        return self.img[y*16:y*16+16,x*16:x*16+16]

    def displayPosition(self, x,y):
        print(self.getBlock(x,y).shape)
        plt.figure(figsize=(1,1))
        plt.imshow(cv2.cvtColor(self.getBlock(x,y), cv2.COLOR_BGR2RGB))
        plt.pause(0.01)
        plt.show()
    
    def set_block(self, x,y, block):
        self.img[y*16:y*16+16,x*16:x*16+16] = block

    def feature_extraction(self, x,y):
        block = self.getBlock(x,y)
        blue_mean = np.mean(block[:, :, 0])
        green_mean = np.mean(block[:, :, 1])
        red_mean = np.mean(block[:, :, 2])

        blue_std = np.std(block[:, :, 0])
        green_std = np.std(block[:, :, 1])
        red_std = np.std(block[:, :, 2])
        block_mean = (blue_mean, green_mean, red_mean)
        block_std = (blue_std, green_std, red_std)
        return block_mean, block_std

    def getBackgroundColors(self):
        self.backGroundColor = {}
        for x in range(self.shape[0]):
            for y in range(self.shape[1]):
                block_mean, block_std = self.feature_extraction(0,0)
                blue_std, green_std, red_std = block_std
                if blue_std == 0 and green_std == 0 and red_std == 0:
                    if (x,y) in self.backGroundColor:
                        self.backGroundColor[(x,y)].append(block_mean)
                    else:
                        self.backGroundColor[(x,y)] = [block_mean]
        return {k:v for k,v in self.backGroundColor.items() if len(v)>10}

    def feature_array(self):
        # Loop over all blocks
        block_features = []
        for x in range(self.shape[0]):
            block_features.append([])
            for y in range(self.shape[1]):
                block_features[-1].append(self.feature_extraction(x,y))
        

    def searchAppearances(self, blocks):
        for name, (x,y) in blocks:
            pass
            
        
    def getTileMap(self, dict):
        # Reshape an image (720, 3072, 3) to (720/16, 3072/16, 16 ,16, 3)
        positional_array = self.img.reshape(self.img.shape[0]//16, 16, self.img.shape[1]//16, 16, 3)
        positional_array = np.moveaxis(positional_array, 1, 2)
        # Change the x and y axis
        positional_array = np.moveaxis(positional_array, 0, 1)
        # Flip the y axis
        positional_array = np.flip(positional_array, axis=1)
        # Combine first two axes
        block_array = positional_array.reshape(-1, 16,16 , 3)
        # reshaped_img = np.moveaxis(reshaped_img, 3, 4)

        # Unique blocks
        unique_blocks = np.unique(block_array, axis=0)

        num_blocks = unique_blocks.shape[0]
        grid_size = int(np.sqrt(num_blocks))+1

        # Reshape to grid
        img_grid = np.zeros((16*grid_size, 16*grid_size, 3), dtype=np.uint8)
        for i in range(grid_size):
            for j in range(grid_size):
                if i*grid_size+j<num_blocks:
                    img_grid[i*16:i*16+16,j*16:j*16+16] = unique_blocks[i*grid_size+j]

        return TileMap(img_grid, dict)
        plt.imshow(cv2.cvtColor(positional_array[0,33], cv2.COLOR_BGR2RGB))
        