#!/usr/bin/env bash

set -e
source /home/vladyslav/.virtualenvs/tensorflow/bin/activate

echo "Start preparation for training AI" > log.txt


python /home/vladyslav/tensorflow1/models/research/object_detection/prepareTF.py >>log.txt

python /home/vladyslav/tensorflow1/models/research/object_detection/xml_to_csv.py >> log.txt

python /home/vladyslav/tensorflow1/models/research/object_detection/generate_tfrecord.py --csv_input=/home/vladyslav/tensorflow1/models/research/object_detection/images/train_labels.csv --image_dir=/home/vladyslav/tensorflow1/models/research/object_detection/images/train/ --output_path=/home/vladyslav/tensorflow1/models/research/object_detection/train.record >> log.txt
python /home/vladyslav/tensorflow1/models/research/object_detection/generate_tfrecord.py --csv_input=/home/vladyslav/tensorflow1/models/research/object_detection/images/test_labels.csv --image_dir=/home/vladyslav/tensorflow1/models/research/object_detection/images/test/ --output_path=/home/vladyslav/tensorflow1/models/research/object_detection/test.record >> log.txt


echo "Start training"  >> log.txt


python /home/vladyslav/tensorflow1/models/research/object_detection/legacy/train.py --logtostderr --train_dir=/home/vladyslav/tensorflow1/models/research/object_detection/training/ --pipeline_config_path=/home/vladyslav/tensorflow1/models/research/object_detection/training/pipeline.config >> log.txt 2>> log.txt & sleep 40m; kill $! 



echo "Convert TS model to TSLite">> log.txt
MODEL_CKPT=$(ls /home/vladyslav/tensorflow1/models/research/object_detection/training | grep "model.ckpt-*" | tail -1 | sed 's/[^0-9]*//g')


python /home/vladyslav/tensorflow1/models/research/object_detection/export_inference_graph.py --input_type image_tensor --pipeline_config_path /home/vladyslav/tensorflow1/models/research/object_detection/ssd_mobilenet_v3_small_coco_2020_01_14/pipeline.config --trained_checkpoint_prefix /home/vladyslav/tensorflow1/models/research/object_detection/training/model.ckpt-$MODEL_CKPT --output_directory /home/vladyslav/tensorflow1/models/research/object_detection/inference_graph >> log.txt 2>> log.txt

python /home/vladyslav/tensorflow1/models/research/object_detection/export_tflite_ssd_graph.py --pipeline_config_path=/home/vladyslav/tensorflow1/models/research/object_detection/ssd_mobilenet_v3_small_coco_2020_01_14/pipeline.config --trained_checkpoint_prefix=/home/vladyslav/tensorflow1/models/research/object_detection/training/model.ckpt-$MODEL_CKPT --output_directory=/home/vladyslav/tensorflow1/models/research/object_detection/inference_graph --add_postprocessing_op=true >> log.txt 2>> log.txt




export CONFIG_FILE=/home/vladyslav/tensorflow1/models/research/object_detection/training/pipeline.config
export CHECKPOINT_PATH=/home/vladyslav/tensorflow1/models/research/object_detection/training/model.ckpt-$MODEL_CKPT
export INPUT_DIR=/home/vladyslav/tensorflow1/models/research/object_detection/inference_graph
export OUTPUT_DIR=/home/vladyslav/tensorflow1/models/research/object_detection/TFLite_model


tflite_convert \
    --graph_def_file=$INPUT_DIR/tflite_graph.pb \
    --output_file=$OUTPUT_DIR/detect.tflite \
    --input_shapes=1,320,320,3 \
    --input_arrays=normalized_input_image_tensor \
    --output_arrays='TFLite_Detection_PostProcess','TFLite_Detection_PostProcess:1','TFLite_Detection_PostProcess:2','TFLite_Detection_PostProcess:3' \
    --inference_type=FLOAT  \
    --allow_custom_ops >> log.txt 2>> log.txt

echo "New AI model was trained, sending new model to turnstile"



rsync -avzh /home/vladyslav/tensorflow1/models/research/object_detection/TFLite_model/ pi@raspberrypi.local:/home/pi/tflite1/model >>log.txt

echo "AI model was updated">>log.txt
