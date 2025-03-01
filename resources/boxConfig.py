import sys

def generate_config_file(center_box, size_box, output_path):
    config_data = [
        f"center_x={center_box[0]}",
        f"center_y={center_box[1]}",
        f"center_z={center_box[2]}",
        f"size_x={size_box[0]}",
        f"size_y={size_box[1]}",
        f"size_z={size_box[2]}"
    ]

    with open(output_path, 'w') as file:
        file.write('\n'.join(config_data))

if __name__ == "__main__":
    # Pegando argumentos da linha de comando
    center_box = [float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3])]
    size_box = [float(sys.argv[4]), float(sys.argv[5]), float(sys.argv[6])]
    output_path = sys.argv[7]

    generate_config_file(center_box, size_box, output_path)
